

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
export const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};