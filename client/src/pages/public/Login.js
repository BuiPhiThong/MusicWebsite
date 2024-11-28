// src/components/Login.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "../../reducers/authSlice";
// import { setRegister, setForgotPassword } from "../../reducers/authSlice"; // Import các actions
import './login.css';
import { useLocation } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isRegister, isForgotPassword } = useSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("isRegister") === "true") {
      dispatch(authReducer.actions.setRegister(true)); // Nếu isRegister là true, bật form đăng ký
    } else {
      dispatch(authReducer.actions.setRegister(false)); // Nếu không, bật form đăng nhập
    }
  }, [location.search, dispatch]);

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

  return (
    <div className="container border p-5 my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <h3>
              {isRegister? "Sign up": isForgotPassword? "Forgot Password": "Sign in"}
            </h3>
          </div>

          {/*Mặc định hiển thị form đăng nhập */}
          {!isRegister && !isForgotPassword && (        
            <form>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Email address"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="formPassword"
                  placeholder="Password"
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
            <form>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="formName"
                  placeholder="Name"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="formUsername"
                  placeholder="Username"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Email"
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="formPassword"
                  placeholder="Password"
                />
              </div>
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I have read and agree to the terms
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign up
              </button>
            </form>
          )}

          {/* Các nút mạng xã hội */}
          <div className="text-center mt-4">
            <div className="d-flex justify-content-center">
              <a href="#" className="btn btn-primary m-1">FB</a>
              <a href="#" className="btn btn-danger m-1">GG</a>
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
};

export default Login;
