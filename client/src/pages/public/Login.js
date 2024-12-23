import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authReducer, { fetchLogin } from "../../reducers/authSlice";
import "./login.css";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { apiRegister } from "../../apis/authen";
function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isRegister, isForgotPassword, isLogged, errorLogin, user, loading } =
    useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [formRegister, setFormRegister] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      swal("Error", "Please enter both email and password", "error");
      return; // Nếu trống, không tiếp tục submit form
    }
    dispatch(fetchLogin({ email: email, password: password }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("isRegister") === "true") {
      dispatch(authReducer.actions.setRegister(true)); // Nếu isRegister là true, bật form đăng ký
    } else {
      dispatch(authReducer.actions.setRegister(false)); // Nếu không, bật form đăng nhập
    }
  }, [location.search, dispatch]);

  // Hiển thị thông báo khi login thành công hoặc thất bại
  useEffect(() => {
    if (isLogged) {
      swal("Success", "Login successful!", "success");
      navigate("/");
    } else if (errorLogin) {
      swal("Error", errorLogin?.response?.data?.message, "error");
    }
  }, [isLogged, errorLogin, navigate]);
  // Hàm chuyển đổi giữa form đăng nhập và đăng ký
  const toggleForm = () => {
    dispatch(authReducer.actions.setRegister(!isRegister));
    dispatch(authReducer.actions.setForgotPassword(false)); // Nếu chuyển sang đăng ký, phải reset forgot password
  };

  // Hàm chuyển đổi sang form Forgot Password
  const showForgotPassword = () => {
    dispatch(authReducer.actions.setForgotPassword(true));
    dispatch(authReducer.actions.setRegister(false)); // Nếu chuyển sang forgot password, phải reset đăng ký
  };

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formRegister };
    updatedForm[name] = value;
    setFormRegister(updatedForm);
  };
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (
      !formRegister.firstname ||
      !formRegister.lastname ||
      !formRegister.email ||
      !formRegister.password
    ) {
      swal({
        title: "Thông báo",
        text: "Vui lòng điền đầy đủ thông tin trước khi đăng ký!",
        icon: "warning",
        buttons: true, // Hiển thị nút đóng
      });
      return;
    }
    try {
      await apiRegister(formRegister)
      swal({
        title: "Đăng ký thành công",
        text: "Vui lòng kiểm tra email để hoàn tất xác thực!",
        icon: "success",
      });
      
    } catch (error) {
      console.log(error);
      
      swal("Error", error?.response?.data?.mess || "Registration failed", "error");
    }
  };
  return (
    <div className="container border p-5 my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <h3>
              {isRegister
                ? "Sign up"
                : isForgotPassword
                ? "Forgot Password"
                : "Sign in"}
            </h3>
          </div>

          {/*Mặc định hiển thị form đăng nhập */}
          {!isRegister && !isForgotPassword && (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="formPassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-between mx-4 mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" onClick={showForgotPassword}>
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign in
              </button>
            </form>
          )}

          {/* Form Forgot Password */}
          {isForgotPassword && (
            <form>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send reset link
              </button>
            </form>
          )}

          {/* Form đăng ký */}
          {isRegister && (
            <form onSubmit={handleSubmitRegister}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="formName"
                  placeholder="FirstName"
                  name="firstname"
                  onChange={handleChangeRegister}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="formUsername"
                  placeholder="LastName"
                  name="lastname"
                  onChange={handleChangeRegister}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Email"
                  name="email"
                  onChange={handleChangeRegister}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="formPassword"
                  placeholder="Password"
                  name="password"
                  onChange={handleChangeRegister}
                />
              </div>
              {/* <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I have read and agree to the terms
                </label>
              </div> */}
              <button type="submit" className="btn btn-primary btn-block">
                Sign up
              </button>
            </form>
          )}

          {/* Các nút mạng xã hội */}
          <div className="text-center mt-4">
            <div className="d-flex justify-content-center">
              <a href="#" className="btn btn-primary m-1">
                FB
              </a>
              <a href="#" className="btn btn-danger m-1">
                GG
              </a>
            </div>
          </div>
          {/* Nút chuyển đổi giữa đăng nhập và đăng ký */}
          <div className="text-center mt-3">
            <button onClick={toggleForm} className="btn btn-link">
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
