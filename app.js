const express = require('express')
const app = express();
require('dotenv').config()
require('./config/mongoose')
const flash = require('connect-flash')
const session = require('express-session');
const parse = require('body-parser');
const morgan = require('morgan');
const indexRoutes = require('./routes/indexRoutes')


app.set('view engine' ,'ejs');

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(parse.urlencoded({extended:true}))
app.use(session({
    secret: 'secret',
    saveUninitialized:false,
    resave: false
}))
app.use(flash());
app.use('/', indexRoutes )
app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`);
})



