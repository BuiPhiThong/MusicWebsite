const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var musicTypeSchema = new mongoose.Schema({
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  musicTypeName: {
    type: String,
    required: true,
  },
  deleted: {
    type: Number,
    default: 0,
  },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model("MusicType", musicTypeSchema);
