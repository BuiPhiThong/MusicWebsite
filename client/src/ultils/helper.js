// src/ultils/authHelpers.js
import {jwtDecode} from "jwt-decode";
export const isTokenExpired = (accessToken) => {
  try {
    if (!accessToken) return true;

    const decoded = jwtDecode(accessToken); // Giải mã JWT
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
    
    return decoded.exp <= currentTime; // Trả về true nếu token đã hết hạn
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Nếu giải mã lỗi, xem như token hết hạn
  }
};
