// src/utils/axios.js
import axios from "axios";
import { apiRefreshToken } from "./apis/authen";

// Tạo một instance axios riêng biệt
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_SERVER,
  withCredentials: true,  // Bật chế độ gửi cookie cùng với yêu cầu
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    let localStorageData = window.localStorage.getItem("persist:root");
    if (localStorageData && typeof localStorageData === "string") {
      localStorageData = JSON.parse(localStorageData);
      const authData = JSON.parse(localStorageData.auth);
      if (authData && authData.accessToken) {
        config.headers["Authorization"] = `Bearer ${authData.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  async (response) => {
    return response.data; // Trả về dữ liệu trong response
  },
  async (error) => {
    const { response, config } = error;
    console.log(error);
    
    if (response?.status === 401) {
      // Kiểm tra xem lỗi 401 là do hết hạn token hay lỗi xác thực
      if (response.data &&  response.data.mess==='Invalid access token!') {
        // Nếu thông báo lỗi là "Token expired", tức là token hết hạn
        if (!config._retry) {
          config._retry = true; // Đánh dấu request đã được retry
          try {
            // Gọi refresh token từ API
            const refreshTokenResponse = await apiRefreshToken();
            if (refreshTokenResponse?.success) {
              const newAccessToken = refreshTokenResponse.accessToken;
              config.headers["Authorization"] = `Bearer ${newAccessToken}`;

              // Retry lại request gốc với token mới
              return axios(config); // Retry the original request with new token
            } else {
              return Promise.reject(error);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }
      } else {
        // Xử lý lỗi 401 do xác thực sai tài khoản/mật khẩu
        return Promise.reject(error);  // Không làm gì thêm nếu là lỗi xác thực
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
