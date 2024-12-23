const mongoose = require("mongoose");

const TempRegisterSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  regisToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // Hết hạn sau 15 phút
});

module.exports = mongoose.model("TempRegister", TempRegisterSchema);
