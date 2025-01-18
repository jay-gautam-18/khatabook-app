const express = require('express')
const app = express();
require('./config/mongoose')
const flash = require('connect-flash')
const session = require('express-session');
const parse = require('body-parser');

const userModels =require('./models/user.models');
const hisaabModels = require('./models/hisaab.models');


app.set('view engine' ,'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(parse.urlencoded({extended:true}))
app.use(session({
    secret: 'secret',
    saveUninitialized:false,
    resave: false
}))
app.use(flash());


app.get('/',(req,res)=>{
    let warns = req.flash('warn')
    res.render('login',{warns})
})

app.post('/login', async (req,res)=>{
    let{username,password} =  req.body
    let user = await userModels.findOne({name:username})
    if(!user){
        req.flash('warn',"wrong password or username")
        res.redirect('/')
    }

    if(user.password == password){
            res.redirect('/home')
        }
        else {
            req.flash('warn',"wrong password or username")
            res.redirect('/');
        }
    
})

app.get("/signup",(req,res)=>{
    let mssg = req.flash('warn')
    res.render('signup',{mssg})
})
app.post('/signup', async (req,res)=>{
    let {username,email,password,confirmPassword} = req.body
    
    if(password === confirmPassword) {
        await userModels.create({
            name:username,
            email:email,
            password:confirmPassword
        })
        res.redirect('/home')

     } else{
            req.flash('warn',"password not matched")
            return res.redirect('/signup');
    }
})

app.get('/home',async (req,res)=>{
    
    let hisaabs = await hisaabModels.find()
    res.render('home',{hisaabs})

})

app.get('/create',(req,res)=>{
    res.render('create')
})
app.post('/create',async (req,res)=>{
    const currentDate = new Date();
    const day = currentDate.getDate()
    const month = currentDate.getMonth()+1
    const year = currentDate.getFullYear()
    const dt = `${day}-${month}-${year}`

   let {name , data ,encryption,edit,shareable, passcode} =req.body
    let enc = encryption === 'on' ? true : false
    let shr = shareable === 'on' ? true : false
    let ed = edit === 'on' ? true : false
    
    
    await hisaabModels.create({
        name,
        data,
        encryption: enc,
        shareable:shr,
        edit:ed,
        passcode,
        createdAt:dt
    })
    res.redirect('/home')

})
app.get('/show/:name', async (req, res) => {
    let hisaab = await hisaabModels.findOne({name:req.params.name})
    res.render('show',{hisaab})
    
   
})
app.get('/edit/:name', async (req,res)=>{
    let hisaab = await hisaabModels.findOne({name:req.params.name})
    res.render('edit',{hisaab});
})
app.post('/update/:_id', async (req,res)=>{
    try{
    let {name , data ,encryption,edit,shareable, passcode} =req.body
    let enc = encryption === 'on';
    let shr = shareable === 'on' ;
    let ed = edit === 'on';
    let newHisaab = await hisaabModels.findOneAndUpdate({_id:req.params._id},{
        name,
        data,
        encryption: enc,
        shareable:shr,
        edit:ed,
        passcode
    },{new:true})
    console.log(newHisaab);
    
    res.redirect('/home')
} catch(err){
    console.log(err);
}
})

app.get("/delete/:name", async (req,res)=>{
    await hisaabModels.findOneAndDelete({name:req.params.name})
    res.redirect('/home')
   
})



app.listen(5001,()=>{
    console.log("Server is running on port 5001");
})