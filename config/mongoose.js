const mongoose = require('mongoose');
async function connectTodb(){
    await mongoose.connect('mongodb://localhost:27017/khatabook')
}
connectTodb();

const db = mongoose.connection

db.on('error',(err)=>{
    console.log(err);
})
db.on("open",()=>{
    console.log("connected to db");
})

module.exports = db;