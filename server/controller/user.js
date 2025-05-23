const User = require("../model/user");
const PlayList = require("../model/playlist");
const TempRegister = require("../model/temRegister");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asynHandler = require("express-async-handler");
const { genAccessToken, genRefreshToken } = require("../middlewares/jwt");
const { sendEmail } = require("../ultils/sendMail");
const crypto = require("crypto");
const uniquid = require("uniqid");
const playlist = require("../model/playlist");
const { default: mongoose } = require("mongoose");

const register = asynHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw new Error("Missing input!");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email has already been registered!");

  const regisToken = uniquid(); // Tạo token duy nhất
  await TempRegister.create({
    firstname,
    lastname,
    email,
    password,
    regisToken,
  });

  const html = `To complete your registration, please click the link below. The link will expire in 5 minutes:
    <a href="${process.env.URL_CLIENT}/finalregister/${regisToken}">Click here</a>`;

  await sendEmail({
    email,
    html,
    subject: "Email Verification",
  });

  return res
    .status(200)
    .json({ success: true, message: "Verification email sent" });
});

const finalRegister = asynHandler(async (req, res) => {
  const { token } = req.params;

  const tempUser = await TempRegister.findOne({ regisToken: token });

  if (!tempUser) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  const newUser = await User.create({
    firstname: tempUser.firstname,
    lastname: tempUser.lastname,
    email: tempUser.email,
    password: tempUser.password,
  });

  await TempRegister.deleteOne({ regisToken: token });

  if (newUser) {
    return res.status(200).json({
      success: true,
      message: "Account verified successfully!",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again.",
    });
  }
});

const login = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Missing input!");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Email does not exist" });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password, role, ...userData } = user.toObject();

      const accessToken = genAccessToken(user._id, role);
      const refreshToken = genRefreshToken(user._id, role); // Sử dụng `_id` và `role`

      // Cập nhật refreshToken trong cơ sở dữ liệu
      await User.findByIdAndUpdate(
        user._id,
        { refreshToken: refreshToken },
        { new: true }
      );

      // Lưu refreshToken vào cookie
      res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(200).json({
        success: true,
        accessToken,
        user: userData,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Login failed",
      });
    }
  }
});

const refreshToken = asynHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken) {
    return res
      .status(403)
      .json({ success: false, message: "No refresh token in cookie!" });
  }
  const decoded = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);

  // Kiểm tra `refreshToken` trong cookie so với token trong DB
  const match = await User.findOne({
    _id: decoded._id,
    refreshToken: cookie.refreshToken,
  });

  if (!match) {
    return res.status(403).json({
      success: false,
      newAccessToken: "Refresh token not matched",
    });
  }
  // Tạo Access Token mới
  const newAccessToken = genAccessToken(match._id, match.role);
  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

const logout = asynHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("Not found refreshToken in cookie!");
  //xóa  refreshtoken trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xóa refreshtoken ở cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully!" });
});

const forgotPassword = asynHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new Error("Missing input!");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email has been not existed!");
  const resetToken = user.createPasswordChangToken();
  await user.save();
  const html = `Để chuyển sang trang đổi mật khẩu, bạn cần click vào đổi mật khẩu. Link sẽ hết hạn sau 5 phút kể từ khi nhận được email:
     <a href="${process.env.URL_CLIENT}/resetpassword/${resetToken}">Đổi mật khẩu</a>`;
  const object = {
    email,
    html,
    subject: "Forgot Password",
  };
  const result = await sendEmail(object);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asynHandler(async (req, res) => {
  const { password } = req.body;
  console.log(password);

  const { token } = req.params;
  console.log(token);

  const checkToken = crypto.createHash("sha256").update(token).digest("hex");

  //so sánh ở db và cái chuỗi mình mang theo từ mail xem có trùng hay hết hạn không
  const user = await User.findOne({
    passwordResetToken: checkToken,
    passwordResetExpire: { $gt: Date.now() },
  }).select("-refreshToken");

  user.password = password;
  (user.passwordResetToken = undefined),
    (user.passwordResetExpire = undefined),
    (user.passwordChangedAt = Date.now());

  await user.save();

  return res.status(200).json({
    success: user ? true : false,
    mess: user ? "Change Password Successfully!" : "Some thing went wrong!",
  });
});

const changePassword = asynHandler(async (req, res) => {
  const { oldpass, newpass } = req.body;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const isMatch = await bcrypt.compare(oldpass, user?.password);
  if (!isMatch) {
    throw new Error("Mật khẩu cũ sai");
  }
  user.password = newpass;

  await user.save();

  return res.status(200).json({
    success: true,
    mess: "Đổi mật khẩu thành công",
  });
});
const getAllUser = asynHandler(async (req, res) => {
  const allUser = await User.find();

  return res.status(200).json({
    success: allUser ? true : false,
    mess: allUser ? allUser : "Some went wrong!",
  });
});

const uploadImageUser = asynHandler(async (req, res) => {
  const { uid } = req.params;
  if (!req.file) throw new Error("Missing input!");

  const updateImg = req.file.path;

  const response = await User.findByIdAndUpdate(
    uid,
    { avatar: updateImg },
    { new: true }
  );

  return res.status(200).json({
    status: response ? true : false,

    mess: response ? response : "Update Avatar  failed!",
  });
});

const updateUser = asynHandler(async (req, res) => {
  const { _id } = req.user;
  if (Object.keys(req.body).length === 0 && !req.file)
    throw new Error("Missing input");

  const data = { ...req.body };
  if (req.file) {
    data.avatar = req.file.path;
  }
  const response = await User.findByIdAndUpdate(_id, data, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Update User failed!",
  });
});

const getCurrent = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate({
    path: "wishlist.songs",
    select: "songName",
  }); // Lấy người dùng duy nhất
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found or AccessToken is invalid!",
    });
  }
  return res.status(200).json({
    success: true,
    mess: user,
  });
});

const createWishlist = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const { sid } = req.params;
  console.log(sid);

  const { name, displayMode } = req.body;

  if (!name) {
    throw new Error("Missing input to create wishlist!");
  }
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ success: false, mess: "User not found!" });
  }
  const isDuplicate = user.wishlist.some((item) => item.name === name);
  if (isDuplicate) {
    throw new Error(`Wishlist with name ${name} has been exited!`);
  }
  const newPlaylist = {
    name,
    displayMode,
    songs: sid ? [sid] : [],
  };
  user.wishlist.push(newPlaylist);
  await user.save();

  return res
    .status(200)
    .json({ success: true, mess: "Create successfully!", data: user });
});

const updateWishlist = asynHandler(async (req, res) => {
  const { sid } = req.params;
  const { wid } = req.body;

  const { _id } = req.user;
  const user = await User.findById(_id);
  const playlist = user?.wishlist.find((el) => el._id.toString() === wid);
  const isRemoved = playlist && playlist.songs.includes(sid);
  if (isRemoved) {
    const result = await User.findOneAndUpdate(
      { _id: _id, "wishlist._id": wid },
      { $pull: { "wishlist.$.songs": sid } },
      { new: true }
    ).select("wishlist");
    return res.status(200).json({
      success: true,
      mess: result?.wishlist.find((el) => el._id.toString() === wid),
      isRemoved,
    });
  }

  // Nếu bài hát không tồn tại trước đó, thêm vào playlist
  const updatedUser = await User.findOneAndUpdate(
    { _id: _id, "wishlist._id": wid },
    { $addToSet: { "wishlist.$.songs": sid } },
    { new: true }
  ).select("wishlist");

  return res.status(200).json({
    success: true,
    mess: updatedUser?.wishlist.find((el) => el._id.toString() === wid),
    isRemoved,
  });
});

const saveAPlaylist = asynHandler(async (req, res) => {
  const { slug } = req.params;
  const { _id } = req.user;
  const playlist = await PlayList.findOne({ slug: slug });
  const wishlist = {
    name: playlist.name + " T-GT",
    image: playlist.image,
    songs: playlist.songs,
  };
  const user = await User.findById(_id);
  const exitedWishlist = user?.wishlist?.find(
    (el) => el?.name === wishlist.name
  );
  if (exitedWishlist) {
    throw new Error(
      `Playlist with name ${playlist?.name} has been saved.Please enter another name to avoid duplicates`
    );
  }
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { wishlist: wishlist } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? wishlist : "Fail to save playlist",
  });
});

const saveAPlaylist2 = asynHandler(async (req, res) => {
  const { slug } = req.params;
  const { _id } = req.user;
  const { name } = req.body;

  const playlist = await PlayList.findOne({ slug: slug });
  const wishlist = {
    name: name + " T-GT",
    image: playlist.image,
    songs: playlist.songs,
  };
  const user = await User.findById(_id);
  const exitedWishlist = user?.wishlist?.find(
    (el) => el?.name === wishlist.name
  );
  if (exitedWishlist) {
    throw new Error(
      `Playlist with name ${name} has been saved.Please enter another name to avoid duplicates`
    );
  }
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { wishlist: wishlist } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mess: response ? wishlist : "Fail to save playlist",
  });
});

const deletedWishlist = asynHandler(async (req, res) => {
  const { wid } = req.params;
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "User not found!",
    });
  }
  const deletedWishlist = user?.wishlist?.filter(
    (item) => item?._id.toString() !== wid
  );
  user.wishlist = deletedWishlist;
  await user.save();
  return res.status(200).json({
    success: true,
    mess: deletedWishlist,
  });
});
const deletedAllWishlist = asynHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    await User.updateOne(
      { _id: _id },
      { $set: { wishlist: [] } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      mess: "The entire wishlist has been successfully deleted",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      mess: "An error occurred while deleting wishlist",
      error: error,
    });
  }
});

const removeSongSearchWishlist = asynHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { wishlistId, songId } = req.body;
    console.log(wishlistId, songId);
    //tại sao dùng updateOne thay vì FindOneandUpdateTrả về { matchedCount, modifiedCount }, đủ để biết thao tác thành công hay không.
    // matchedCount trả về docoment khớp với điều kiện tìm kiếm
    // modifiedCount trả về số lượng document được sửa đổi
    const result = await User.updateOne(
      { _id: _id, "wishlist._id": wishlistId },
      {
        $pull: {
          "wishlist.$.songs": new mongoose.Types.ObjectId(songId),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        mess: "User or wishlist not found!",
      });
    }
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        mess: "Song not found in wishlist or already removed!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Song removed from wishlist successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

const updateWishlistInManageAccount = asynHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    const { idWishlist, ...updateData } = req.body;

    const updateFields = {};

    if (updateData.description)
      updateFields["wishlist.$.description"] = updateData.description;
    if (updateData.name) updateFields["wishlist.$.name"] = updateData.name;
    if (updateData.displayMode)
      updateFields["wishlist.$.displayMode"] = updateData.displayMode;

    if (req.file) {
      updateFields["wishlist.$.image"] = req.file.path;
    }

    // Xử lý songs - parse JSON string và chuyển đổi sang ObjectId
    if (updateData.songs) {
      try {
        const songs = JSON.parse(updateData.songs);
        if (Array.isArray(songs)) {
          updateFields["wishlist.$.songs"] = songs.map(
            (id) => new mongoose.Types.ObjectId(id)
          );
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          mess: "Invalid songs format",
        });
      }
    }

    // Thực hiện update
    if (idWishlist) {
      const result = await User.updateOne(
        {
          _id: _id,
          "wishlist._id": idWishlist,
        },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          mess: "Wishlist not found!",
        });
      }

      return res.status(200).json({
        success: true,
        mess: "Wishlist updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        mess: "Wishlist ID is required",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      mess: error.message,
    });
  }
});

module.exports = {
  register,
  getAllUser,
  login,
  refreshToken,
  logout,
  forgotPassword,
  changePassword,
  resetPassword,
  uploadImageUser,
  updateUser,
  getCurrent,
  finalRegister,
  createWishlist,
  updateWishlist,
  saveAPlaylist,
  saveAPlaylist2,
  deletedWishlist,
  deletedAllWishlist,
  removeSongSearchWishlist,
  updateWishlistInManageAccount,
};
