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
  songs: [{type: mongoose.Schema.Types.ObjectId,ref: "Song"}],
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("PlayList", playlistSchema);
