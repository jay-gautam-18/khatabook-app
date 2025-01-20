const mongoose = require('mongoose')

let userModels = new mongoose.Schema({
    name: String,
    password:Number,
    email:String
})

module.exports = mongoose.model("user", userModels)