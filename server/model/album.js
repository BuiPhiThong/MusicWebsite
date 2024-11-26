const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var albumSchema = new mongoose.Schema({
  albumName: {
    type: String,
    required: true,
  },
  paticipateSingerId: [
    {type: mongoose.Schema.Types.ObjectId,ref: "Singer",required: true}
  ],
  songs: [{type: mongoose.Schema.Types.ObjectId,ref: "Song",required:true}],
  releaseDate: {
    type: String,
    required: true
  },
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
