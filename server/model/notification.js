const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  deleted:{
    type:Number,
    default:0
  }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("Notification", notificationSchema);
