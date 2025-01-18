const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var historySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    songId:{
        type:mongoose.Schema.ObjectId,
        ref:'Song'
    },
    playlistId:{
        type:mongoose.Schema.ObjectId,
        ref:"Playlist"
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
});

//Export the model
module.exports = mongoose.model('History', historySchema);