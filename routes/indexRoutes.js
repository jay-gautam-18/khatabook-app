const express = require('express')
const Router = express.Router()
const { indexController , loginController ,newFirst, signupController, signupController2,homeController ,createController,createController2,encrypt,editcheck,show,edit,update ,deleteController} = require('../controllers/indexController') 

Router.get('/', indexController )
Router.post('/login', loginController )   
Router.get("/signup", signupController )
Router.post('/signup', signupController2 )
Router.get('/home',homeController)
Router.get('/newFirst',newFirst) 
Router.get('/create', createController)
Router.post('/create', createController2)
Router.post('/encrypt/:id', encrypt);
Router.get('/show/:name', show)
Router.get('/editcheck/:name' , editcheck)
Router.get('/edit/:name', edit)
Router.post('/update/:_id', update );
Router.get("/delete/:name", deleteController )

 module.exports=Router