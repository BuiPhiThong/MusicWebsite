const diacritics = require("diacritics");

export const createSlug = (str) => {
    str = str.trim(); // loại bỏ khoảng trắng đầu và cuối
    str = str.toLowerCase(); // chuyển toàn bộ chuỗi sang chữ thường
    
    // Loại bỏ các dấu tiếng Việt
    str = diacritics.remove(str)

    // Xử lý chuỗi để tạo slug
    str = str.replace(/[^a-z0-9 -]/g, '') // loại bỏ các ký tự không hợp lệ
             .replace(/\s+/g, '-') // thay thế khoảng trắng bằng dấu '-'
             .replace(/-+/g, '-'); // thay thế nhiều dấu '-' liên tiếp bằng 1 dấu '-'

    return str;
};
