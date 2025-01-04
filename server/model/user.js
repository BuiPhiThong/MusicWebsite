const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: Boolean,
      default:true
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpire: {
      type: String,
    },
    wishlist: [
      {
        image: { type: String },
        name: { type: String, require: true },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
        description: { type: String },
        displayMode:{type:String,enum:["Private","Public"],default:"Public"}
      }
    ],

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    isVip: {
      type: Boolean,
      default: false,
    }, // Trạng thái VIP
    vipAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VipAccount",
    },
    typeLogin: {
      type: String,
      default: "local",
    },
    deleted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();//dùng để đổi mật khẩu hay đăng kí khi mật khẩu có sự thay đổi 
  }
  const salt = bcrypt.genSaltSync(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
  createPasswordChangToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpire = Date.now() + 5 * 60 * 1000;
    return resetToken;
  },
};
module.exports = mongoose.model("User", userSchema);
// default: () => {
//   const today = new Date();
//   const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày và đảm bảo có 2 chữ số
//   const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
//   const year = today.getFullYear();
//   return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
// },