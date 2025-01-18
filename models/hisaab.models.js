const mongoose = require('mongoose')

let hisaabModel = new mongoose.Schema({
    name: String,
    data:String,
    encryption:{
        type:Boolean,
        default:false
    },
    shareable:{
        type:Boolean,
        default:false
    },
    edit:{
        type:Boolean,
        default:false
    },
    passcode:{
        type:Number,
        default:null
    },
    createdAt: String

})

module.exports = mongoose.model('hissab',hisaabModel)