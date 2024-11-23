const mongoose = require("mongoose");

const vipAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người dùng đăng ký
  subscriptionType: {
    type: String,
    enum: ["monthly", "yearly", "lifetime"], // Loại gói: tháng, năm, trọn đời
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }, 
  startDate: {
    type:String
  }, 
  endDate: {
    type: String,
  }, 
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"], // Trạng thái gói
    default: "active",
  },
  paymentMethod: {
    type: String,
    default: "paypal",
  }, // Phương thức thanh toán
});

module.exports = mongoose.model("VipAccount", vipAccountSchema);
