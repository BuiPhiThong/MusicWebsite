const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var countrySchema = new mongoose.Schema({
    countryName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    deleted:{
        type:Number,
        default: 0
    }
},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Country', countrySchema);