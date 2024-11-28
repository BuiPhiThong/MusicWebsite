const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var playlistTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    delete:{
        type:Number,
        default:0
    }
},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('PlaylistType', playlistTypeSchema);