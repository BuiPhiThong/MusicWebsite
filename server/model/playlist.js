const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image:{
    type: String,
    required:true
  },
  songs: [{type: mongoose.Schema.Types.ObjectId,ref: "Song"}],
  typePlaylist:{
    type: mongoose.Types.ObjectId,
    ref:'PlaylistType'
  },
  views: { 
    type: Number,
    default: 0,
  },
  // isPublic: {
  //   type: Boolean,
  //   default: false, // Mặc định là riêng tư
  // },
  // sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Người dùng được chia sẻ playlist riêng tư
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("PlayList", playlistSchema);
