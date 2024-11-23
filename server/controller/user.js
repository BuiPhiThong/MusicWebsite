const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asynHandler = require("express-async-handler");
const { genAccessToken, genRefreshToken } = require("../middlewares/jwt");
const { sendEmail } = require("../ultils/sendMail");
const crypto = require('crypto')

const register = asynHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    throw new Error("Missing input!");
  }

  const user = await User.findOne({ email: email });
  // console.log(user);

  if (user) throw new Error("Email has been existed!!");

  const createUser = await User.create(req.body);

  return res.status(200).json({
    success: true,
    mess: createUser ? createUser : "Create User Failed!",
  });
});

const login = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Missing input!");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Email does not exist");
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
        secure: true,
        sameSite: "Strict",
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
  const { email } = req.query;
  if (!email) throw new Error("Missing input!");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email has been not existed!");
  const resetToken = user.createPasswordChangToken();
 await user.save()
  const html = `Để chuyển sang trang đổi mật khẩu, bạn cần click vào đổi mật khẩu. Link sẽ hết hạn sau 15 phút kể từ khi nhận được email:
     <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">Đổi mật khẩu</a>`;
  const object = {
    email,
    html,
  };
  const result = await sendEmail(object);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asynHandler(async(req,res)=>{
    const {password, token } = req.body
    // console.log(password);
    
    if(!password || !token) throw new Error('Missing input')

    const checkToken =   crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      passwordResetToken: checkToken,
      passwordResetExpire:{$gt: Date.now()}
    }).select('-refreshToken')
    // console.log(user);
    
    user.password = password
    user.passwordResetToken= undefined,
    user.passwordResetExpire=undefined,
    user.passwordChangedAt=Date.now()

   await user.save()

    return res.status(200).json({
      success : user?true:false,
      mess:user?'Change Password Successfully!': 'Some thing went wrong!'
    })
})

const getAllUser = asynHandler(async (req, res) => {
  const allUser = await User.find();

  return res.status(200).json({
    success: allUser ? true : false,
    mess: allUser ? allUser : "Some went wrong!",
  });
});

module.exports = {
  register,
  getAllUser,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword
};
