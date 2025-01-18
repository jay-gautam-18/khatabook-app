const mongoose = require('mongoose')

let userModels = new mongoose.Schema({
    name: String,
    password:String,
    email:String
})

module.exports = mongoose.model("user", userModels)