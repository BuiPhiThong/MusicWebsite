const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image:{
    type: String
  },
  songs: [{type: mongoose.Schema.Types.ObjectId,ref: "Song"}],
  isPublic: {
    type: Boolean,
    default: false, // Mặc định là riêng tư
  },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Người dùng được chia sẻ playlist riêng tư
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("PlayList", playlistSchema);
