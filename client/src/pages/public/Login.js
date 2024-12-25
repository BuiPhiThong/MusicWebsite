import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authReducer, { fetchLogin } from "../../reducers/authSlice";
import "./login.css";
import { useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { apiForgotPassword, apiLoginGoogle, apiRegister } from "../../apis/authen";
import { useForm } from "react-hook-form";

function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const navigate = useNavigate();
  const { isRegister, isForgotPassword, isLogged, errorLogin, user, loading } =
    useSelector((state) => state.auth);
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [formRegister, setFormRegister] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [emailReset, setEmailReset] = useState("");
  const handleSubmitLogin = (e) => {
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
  
  // const handleChangeRegister = (e) => {
    //   const { name, value } = e.target;
    //   const updatedForm = { ...formRegister };
    //   updatedForm[name] = value;
    //   setFormRegister(updatedForm);
    // };
    const onSubmitRegister = async (data) => {
      try {
        await apiRegister(data);
        swal({
          title: "Đăng ký thành công",
          text: "Vui lòng kiểm tra email để hoàn tất xác thực!",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        
        swal(
          "Oop!",
          error?.response?.data?.mess || "Registration failed",
          "error"
        );
      }
    };
    const handleSubmitResetPass = async (e) => {
      e.preventDefault();
      console.log(emailReset);
      
      if (!emailReset) {
        swal({
          title: "Thông báo",
          text: "Vui lòng điền đầy đủ email để lấy mật khẩu!",
          icon: "warning",
        });
        return;
      }
      try {
        await apiForgotPassword({ email: emailReset });
        swal({
          title: "Forgot thành công",
          text: `Vui lòng kiểm tra email ${emailReset}  để hoàn tất đổi mật khẩu!`,
        icon: "success",
      });
      setEmailReset("");
    } catch (error) {
      console.log(error);
      
      swal("Error", error?.response?.data?.mess || "ForgotPassword failed", "error");
    }
  };
  
  const handleLoginGoogle = async ()=>{
      window.location.href = "http://localhost:5000/api/auth/google";
  }
  const handleLoginFacebook = async ()=>{
    window.location.href = "http://localhost:5000/api/auth/facebook";
}
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("accessToken");
    if (token) {
      dispatch(authReducer.actions.updateAccessToken(token));
      navigate("/");
    }
  }, [location, navigate, dispatch]); 
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
            <form onSubmit={handleSubmitLogin}>
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
                <div className="form-check"></div>
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
            <form onSubmit={handleSubmitResetPass} method="post">
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="formEmail"
                  placeholder="Enter your email"
                  onChange={(e) => setEmailReset(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send reset link
              </button>
            </form>
          )}

          {/* Form đăng ký */}
          {isRegister && (
            <form onSubmit={handleSubmit(onSubmitRegister)}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  {...register("firstname", {
                    required: "Họ là bắt buộc.",
                  })}
                />
                {errors?.firstname && (
                  <span className="text-danger">
                    {errors?.firstname?.message}
                  </span>
                )}
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  {...register("lastname", {
                    required: "Tên là bắt buộc.",
                    pattern:{
                      value:/^[A-Z][a-zA-Z]*$/,
                      message:'Bắt đầu bằng chữ cái hoa'
                    }
                  })}
                />
                {errors.lastname && (
                  <span className="text-danger">{errors.lastname.message}</span>
                )}
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  {...register("email", {
                    required: "Email là bắt buộc.",
                    pattern: {
                      value: /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email không đúng định dạng.",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc.",
                    minLength: {
                      value: 6,                    
                      message: "Mật khẩu phải có ít nhất 6 ký tự.",
                    },
                    pattern:{
                      value:/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
                      message:"Mật khẩu cần có 1 chữ cái in hoa và 1 kí tự đặc biệt"
                    }
                  })}
                />
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
                )}
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
              <button  className="btn btn-primary m-1" onClick={()=>handleLoginFacebook()}>
                FB
              </button>
              <button  className="btn btn-danger m-1" onClick={()=>handleLoginGoogle()}>
                GG
              </button>
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
