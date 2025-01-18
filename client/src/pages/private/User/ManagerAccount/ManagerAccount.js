import React, { useEffect, useState } from "react";
import "./ManagerAccount.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrent } from "../../../../reducers/authSlice";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { Login } from "../../../public";
import {
  convertToDate,
  convertToDateInputFormat,
} from "../../../../ultils/helper";
import {
  apiChangePassword,
  apiDeleteAllWishlist,
  apiDeleteWishlist,
  apiUpdateProfile,
} from "../../../../apis/user";
import { useForm } from "react-hook-form";
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  rel="stylesheet"
/>;

const ManagerAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLogged, user, accessToken } = useSelector((state) => state.auth);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [modelPass, setModelPass] = useState(false);
  const [notifyConfirm, setNotifyConfirm] = useState(false);
  const [editImage, setEditImage] = useState(null); //Lưu trữ để hiển thị ngay khi chọn
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null); // Lưu trữ file ảnh để gửi lên cloudary
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const [selectedAllPlaylist, setSelectedAllPlaylist] = useState([]);

  // Trạng thái lưu mục được chọn
  const [activeItem, setActiveItem] = useState("Manager");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [formEdit, setFormEdit] = useState({
    firstname: "",
    lastname: "",
    avatar: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    description: "",
  });
  const [initialFormEdit, setInitialFormEdit] = useState({
    firstname: "",
    lastname: "",
    avatar: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    description: "",
  });
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("managerprofile") === "true") {
      setActiveItem("manager");
    }
  }, [location]);
  useEffect(() => {
    if (isLogged && accessToken) {
      dispatch(fetchCurrent());
    }
  }, [dispatch, isLogged, accessToken]);

  useEffect(() => {
    if (user) {
      const initialForm = {
        ...user,
        dateOfBirth: user?.dateOfBirth
          ? convertToDateInputFormat(user?.dateOfBirth)
          : "",
      };
      setFormEdit(initialForm);
      setInitialFormEdit(initialForm);
    }
  }, [user]);

  // Hàm xử lý khi nhấp vào mục menu
  const handleMenuClick = (item) => {
    setActiveItem(item); // Lưu mục đang được chọn
  };
  const handleChooseImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast("Please choose an image", "error");
      return;
    }
    const validImageType = ["image/png", "image/jpeg"];
    if (!validImageType.includes(file.type)) {
      toast(
        "Invalid file type. Please choose an image type in (PNG, JPEG)",
        "error"
      );
      return;
    }
    setSelectedAvatarFile(file);
    console.log(file);

    const reader = new FileReader();
    reader.onload = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleBackEdit = () => {
    setIsEditProfile(false);
    setEditImage(null);
    setSelectedAvatarFile(null);
    setFormEdit(initialFormEdit);
  };
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    if (name === "dateOfBirth") {
      const [year, month, day] = value.split("-"); //type mặc định của input date
      setFormEdit((prev) => ({
        ...prev,
        [name]: `${year}-${month}-${day}`,
      }));
    } else {
      setFormEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const hanldeSubmitEdit =async(e)=>{
  //   e.preventDefault()
  //   const dateOfBirth=formEdit?.dateOfBirth
  //   const imgUpdated= selectedAvatarFile
  //   const dataEdit ={...formEdit,dateOfBirth:convertToDate(dateOfBirth),avatar:imgUpdated}
  //   console.log("dataEdit",dataEdit);
  //   try {
  //     const response = await apiUpdateProfile(dataEdit)
  //     console.log(response);

  //   } catch (error) {

  //   }
  // }
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const dateOfBirth = formEdit?.dateOfBirth;
    const imgUpdated = selectedAvatarFile;

    // Tạo FormData để gửi dữ liệu lên server
    const formData = new FormData();

    formData.append("firstname", formEdit.firstname);
    formData.append("lastname", formEdit.lastname);
    formData.append("gender", formEdit.gender);
    formData.append("dateOfBirth", convertToDate(dateOfBirth)); // Convert lại nếu cần
    if (formEdit?.address) {
      formData.append("address", formEdit.address);
    }
    if (formEdit?.description) {
      formData.append("description", formEdit.description);
    }

    if (imgUpdated) {
      formData.append("avatar", imgUpdated);
    }

    console.log("FormData gửi đi:", formData);

    try {
      const response = await apiUpdateProfile(formData);
      if (response?.success) {
        toast("Update Profile Successfully!", "success");
        dispatch(fetchCurrent());
      }
    } catch (error) {
      toast("Update Profile Failed!", "fail");
    }
  };
  const handleCloseModelPass = () => {
    setModelPass(false);
    setNotifyConfirm(false);
    reset();
  };
  const handleChangePassword = async (data) => {
    try {
      const dataChange = {
        oldpass: data?.oldpassword,
        newpass: data?.newpassword,
      };
      const response = await apiChangePassword(dataChange);
      console.log(response);
      if (response?.success) {
        toast(`${response?.mess}`);
      }
    } catch (error) {
      toast(`${error?.response?.data?.mess}`);
    }
  };

  const handleSelectedPlaylist = (id) => {
    if (!selectedPlaylist.includes(id)) {
      setSelectedPlaylist((prev) => [...prev, id]);
      // setSelectedAllPlaylist((prev) => [...prev, id]);
    } else {
      const filteredCheckbox = selectedPlaylist.filter((item) => item !== id);
      setSelectedPlaylist(filteredCheckbox);
      // setSelectedAllPlaylist(filteredCheckbox);
    }
  };
  // console.log(selectedPlaylist);

  const handleCheckAllPlaylist = () => {
    if (idCheckAll?.length === selectedPlaylist?.length) {
      setSelectedPlaylist([]);
    } else {
      setSelectedPlaylist(idCheckAll);
    }
  };

  const idCheckAll = user?.wishlist?.map((item) => item?._id);

  const newPassword = watch("newpassword");

  const handleDeletedPlaylist = async (id) => {
    const alert = window.confirm(`Are you sure to delete wishlist?`);
    console.log(alert);

    if (alert) {
      try {
        const response = await apiDeleteWishlist(id);
        if (response?.success) {
          toast("Deleted wishlist successfully!");
          dispatch(fetchCurrent());
        }
      } catch (error) {
        toast("Fail to deleted");
      }
    }
  };

  const handleDeleteAllPlaylist = async () => {
    if (idCheckAll?.length === selectedPlaylist?.length && idCheckAll?.length>0) {
      const alert = window.confirm("Are you sure to delete all wishlist");
      if (alert) {
        try {
          const response = await apiDeleteAllWishlist();
          if (response?.success) {
            toast(`${response?.mess}`);
            dispatch(fetchCurrent());
          }
        } catch (error) {}
      }
    }
  };
  return (
    <div className="wraper mt-4">
      <div className="content-wraper row">
        <div className="col-md-2 box-left-user">
          <div className="box-img-avatar">
            <img
              src={
                user?.avatar ||
                "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
              }
              alt="User Avatar"
            />
            <p>{user?.lastname || "John"}</p>
          </div>
          <ul className="sidebar-menu">
            <li
              className={activeItem === "manager" ? "active" : ""}
              onClick={() => handleMenuClick("manager")}
            >
              Quản lý
            </li>
            <li
              className={activeItem === "playlist" ? "active" : ""}
              onClick={() => handleMenuClick("playlist")}
            >
              Playlist
            </li>
            <li
              className={activeItem === "friend" ? "active" : ""}
              onClick={() => handleMenuClick("friend")}
            >
              Bạn Bè
            </li>
            <li
              className={activeItem === "history" ? "active" : ""}
              onClick={() => handleMenuClick("history")}
            >
              Lịch sử
            </li>
            <li
              className={activeItem === "logout" ? "active" : ""}
              onClick={() => handleMenuClick("logout")}
            >
              Đăng xuất
            </li>
          </ul>
        </div>

        {activeItem === "manager" ? (
          isEditProfile ? (
            <div className="col-md-10">
              <div className="box-group-left">
                <div className="box-detail-info">
                  <span className="txt-sub-group">Cập nhật tài khoản</span>
                  <form
                    className="update-account-form"
                    method="put"
                    onSubmit={handleSubmitEdit}
                  >
                    <div className="form-group">
                      <label htmlFor="avatar">Avatar</label>
                      <div className="avatar-container">
                        {/* Hiển thị ảnh avatar */}
                        <div className="avatar-preview">
                          <img
                            id="avatar-preview"
                            src={
                              editImage ||
                              user?.avatar ||
                              "https://stc-id.nixcdn.com/v11/images/avatar_default_2020.png"
                            }
                            alt="Avatar Preview"
                          />
                        </div>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          name="avatar"
                          onChange={handleChooseImage}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="displayName">Họ</label>
                      <input
                        type="text"
                        id="displayName"
                        name="firstname"
                        value={formEdit?.firstname}
                        onChange={handleChangeEdit}
                        placeholder="Nhập tên hiển thị"
                      />
                      <label htmlFor="displayName">Tên</label>
                      <input
                        type="text"
                        id="displayName"
                        name="lastname"
                        value={formEdit?.lastname}
                        onChange={handleChangeEdit}
                        placeholder="Nhập tên hiển thị"
                      />
                      <label htmlFor="birthdate">Ngày sinh</label>
                      <div className="birthdate-group">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formEdit?.dateOfBirth || ""}
                          onChange={handleChangeEdit}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">Giới tính</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formEdit?.gender === true ? "true" : "false"}
                        onChange={handleChangeEdit}
                      >
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Địa chỉ</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formEdit?.address}
                        onChange={handleChangeEdit}
                        placeholder="Thành phố, Tỉnh"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">Giới thiệu</label>
                      <textarea
                        id="bio"
                        name="description"
                        value={formEdit?.description}
                        onChange={handleChangeEdit}
                        placeholder="Giới thiệu ngắn về bạn..."
                        rows="4"
                      ></textarea>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        Lưu thay đổi
                      </button>
                      <button
                        type="button"
                        className="btn-back"
                        onClick={() => handleBackEdit()}
                      >
                        Trở lại
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-10 box-right-user">
              <div className="box-group-left2">
                <div className="box-detail-info">
                  <span className="txt-sub-group">
                    Giới thiệu
                    <div className="box_user_action">
                      <a
                        href="#"
                        className="btn_edit_item text-decoration-none"
                        onClick={() => setIsEditProfile(true)}
                      >
                        Chỉnh sửa
                      </a>
                    </div>
                  </span>
                  <p>ID: {user?._id} </p>
                  <p>FirstName: {user?.firstname}</p>
                  <p>LastName: {user?.lastname}</p>
                  <p>Date of Birth: {user?.dateOfBirth}</p>
                </div>

                <div className="box-detail-info">
                  <span className="txt-sub-group">Tài khoản</span>
                  <p>Tên tài khoản: gg.tranlyy1603</p>
                  <p>
                    Mật khẩu:{" "}
                    <a
                      className="password-link"
                      onClick={() => setModelPass(true)}
                    >
                      Đổi mật khẩu
                    </a>
                  </p>
                  <p>Email: tranlyy1603@gmail.com (Kích hoạt tài khoản)</p>
                  <p>Số ĐT kích hoạt: 0312006664 (đã xác thực)</p>
                  <p>
                    Ngày hết hạn: Bạn chưa có{" "}
                    <a className="password-link">Tài khoản vip</a>
                  </p>
                </div>
              </div>
              <div className="box-group-right">
                <div className="box-detail-info">
                  <span className="txt-sub-group">Thông tin cá nhân</span>
                  <p>
                    Địa chỉ: {user?.address ? user.address : "Chưa cập nhật"}
                  </p>
                  <p>Giới tính: {user?.gender === true ? "Nam" : "Nữ"}</p>
                  <p>Quốc gia: Việt Nam</p>
                </div>
                <div className="box-detail-info">
                  <span className="txt-sub-group">Cài đặt</span>
                  <p>Nhận thông báo: Có</p>
                  <p>Ngôn ngữ: Tiếng Việt</p>
                </div>
              </div>
            </div>
          )
        ) : (
          ""
        )}

        {activeItem === "playlist" ? (
          <div className="col-md-10">
            <div className="box-group-left">
              <h2 className="" style={{ color: "#0689ba" }}>
                Playlist
              </h2>
            </div>
            <div className="check_field_delete box-checkbox">
              <input
                id="checkAll"
                type="checkbox"
                checked={idCheckAll.length>0 && idCheckAll?.length === selectedPlaylist?.length}
                onClick={() => handleCheckAllPlaylist()}
              />
              <label for="checkbox1">&nbsp;</label>
              <a
                className="btn_delete_checkbox mx-1 text-decoration-none"
                onClick={() => handleDeleteAllPlaylist()}
              >
                Xóa
              </a>
              <a className="btn_delete_checkbox active text-decoration-none">
                Tạo Playlist
              </a>
            </div>

            <div className="user_cp_profile_playlist">
              <ul className="show_cp_profile_playlist">
                {user?.wishlist?.map((item, index) => (
                  <li key={index}>
                    <div className="box_action_edit">
                      <a href="" className="btn_edit_item"></a>
                      <a href="" className="btn_delete_item"></a>
                    </div>
                    <span className="check_data box-checkbox mx-2">
                      <input
                        id={`check-${item?._id}`} // Đảm bảo ID là duy nhất
                        type="checkbox"
                        name="check_video"
                        checked={selectedPlaylist?.includes(item?._id)}
                        onChange={() => handleSelectedPlaylist(item?._id)}
                      />
                      <label htmlFor={`check-${item?._id}`}>&nbsp;</label>{" "}
                    </span>

                    <div className="content">
                      <div className="box-left">
                        <a href="" className="avatar">
                          <img
                            src={
                              item?.image ||
                              "https://avatar-ex-swe.nixcdn.com/playlist/2024/12/05/a/4/a/b/1733388587539.jpg"
                            }
                            alt=""
                          />
                        </a>
                      </div>
                      <div className="box-right">
                        <h3>
                          <a
                            href=""
                            className="name_album_search text-decoration-none"
                          >
                            {item?.name}
                          </a>
                        </h3>
                        <div className="box_list_singer">
                          <span></span>
                          Đang Cập Nhật
                        </div>
                        <div className="box_info_upload_export">
                          <span></span>
                        </div>
                      </div>
                      <div className="box-actions">
                        <a
                          className="btn_delete_checkbox mx-1 text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeletedPlaylist(item?._id);
                          }}
                        >
                          Xóa
                        </a>
                        <a
                          href=""
                          className="btn_delete_checkbox mx-1 text-decoration-none active"
                        >
                          Chỉnh sửa
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          ""
        )}

        {modelPass && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2>Đổi Mật Khẩu</h2>
              <form
                className="password-form"
                method="put"
                onSubmit={handleSubmit(handleChangePassword)}
              >
                <div className="form-group">
                  <label htmlFor="oldPassword">Mật khẩu cũ</label>
                  <input
                    type="password"
                    placeholder="Old Password"
                    {...register("oldpassword", {
                      required: "Nhập mật khẩu cũ",
                    })}
                  />
                  {errors?.oldpassword && (
                    <span className="text-danger">
                      {errors?.oldpassword?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    {...register("newpassword", {
                      required: "Nhập mật khẩu mới",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu cần có ít nhất 6 kí tự",
                      },
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                        message:
                          "Mật khẩu cần có 1 chữ cái in hoa và 1 kí tự đặc biệt",
                      },
                    })}
                  />
                  {errors?.newpassword && (
                    <span className="text-danger">
                      {errors?.newpassword?.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Xác nhận mật khẩu là bắt buộc",
                      validate: (value) =>
                        value === newPassword || "Mật khẩu xác nhận không khớp",
                    })}
                  />
                  {errors?.confirmPassword && (
                    <span>{errors.confirmPassword.message}</span>
                  )}
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCloseModelPass}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-submit">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAccount;
