const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var singerSchema = new mongoose.Schema(
  {
    singerNickName: {
      type: String,
    },
    singerName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    national: {
      type:mongoose.Types.ObjectId,
      ref:'Country',
      required:true
    },
    gender: {
      type: Boolean,
    },
    singerStory: {
      type: String,
    },
    singerImg: {
      type: String,
    },
    playlist: [
      {
        img:{type:String},
        name: { type: String, require: true,unique:true },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
        description: { type: String },
      },
    ],
    album: [
      {
        img:{type:String},
        name: { type: String, require: true },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
        description: { type: String },
      },
    ],
    userRegister: [{type:mongoose.Types.ObjectId,ref:'User'}],
    numberofregistrations: {
      type: Number,
      default: 0,
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

//Export the model
module.exports = mongoose.model("Singer", singerSchema);
