const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var albumSchema = new mongoose.Schema({
  albumName: {
    type: String,
    required: true,
  },
  singerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Singer",
    required: true,
  },
  releaseDate: {
    type: String
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  albumImg: {
    type: String,
  },
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("Album", albumSchema);
