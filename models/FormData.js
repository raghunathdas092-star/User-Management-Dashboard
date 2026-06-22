const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("FormData",formSchema);