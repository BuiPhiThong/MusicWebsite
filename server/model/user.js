const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
    whislist: [
      {
        songId: {
          type: mongoose.Types.ObjectId,
          ref: "Song",
        },
        singerId: {
          type: mongoose.Types.ObjectId,
          ref: "Singer",
        },
      },
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
  if(!this.isModified('password')){
    next()
  }
  const salt = bcrypt.genSaltSync(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods={
  createPasswordChangToken : function(){
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpire= Date.now()+ 15*60*1000
    return resetToken
  }
}
module.exports = mongoose.model("User", userSchema);
