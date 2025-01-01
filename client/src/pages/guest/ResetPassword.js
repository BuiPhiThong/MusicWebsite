import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { apiResetPassword } from '../../apis/authen';  // Đảm bảo import đúng

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notify, setNotify] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();  // Lấy token từ URL params

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      swal({
        title: "Thông báo",
        text: "Vui lòng điền đầy đủ thông tin để đổi mật khẩu!",
        icon: "warning",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotify(true);
      return;
    }

    try {
      await apiResetPassword(token, newPassword);  // Gọi API để đổi mật khẩu
      swal({
        title: "Thành công",
        text: "Đổi mật khẩu thành công!",
        icon: "success",
      });
      navigate('/login');  // Sau khi đổi mật khẩu thành công, chuyển hướng người dùng đến trang đăng nhập
    } catch (error) {
      console.log(error);
      swal({
        title: "Lỗi",
        text: "Đã hết thời gian hoặc đã đổi mật khẩu thành công!",
        icon: "error",
      });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center mt-4">
      <div className="reset-password w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword}>
          {/* Trường nhập mật khẩu mới */}
          <div className="form-group mb-3">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Trường nhập xác nhận mật khẩu */}
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {notify && <p className="text-danger">Mật khẩu và xác nhận mật khẩu không khớp</p>}

          {/* Nút gửi form */}
          <button type="submit" className="btn btn-primary btn-block">
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
