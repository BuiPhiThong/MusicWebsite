const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var songSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true,
  },
  freelanceNameSinger:{
    type:String
  },
  singerId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
      required:true
    },
  ],
  musictypeId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicType",
      required:true
    },
  ],
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  songAbout: {
    type: String,
  },
  songLyrics: {
    type: String,
  },
  songImg: {
    type: String,
  },
  listenCountSum: {
    type: Number,
    default: 0,
  },
  listenCountWeek: {
    type: Number,
    default: 0,
  },
  listenCountMonth: {
    type: Number,
    default: 0,
  },
  uploadBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  audioPaths: {
    normal: { type: String, required: true }, // Đường dẫn tệp nhạc thường (128kbps)
    vip: { type: String, required: true },    // Đường dẫn tệp nhạc VIP (320kbps)
  },
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("Song", songSchema);
