const express = require('express')
const app = express();
require('./config/mongoose')
const flash = require('connect-flash')
const session = require('express-session');
const parse = require('body-parser');
const morgan = require('morgan');

const userModels =require('./models/user.models');
const hisaabModels = require('./models/hisaab.models');

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


app.get('/',(req,res)=>{
    let warns = req.flash('warn')
    res.render('login',{warns})
})

app.post('/login', async (req,res)=>{
    let{username,password} =  req.body
    let user = await userModels.findOne({name:username})
    
    try{
    if(!user){
        req.flash('warn',"wrong password or username")
        return res.redirect('/')
    }

    if(user.password == password) return res.redirect('/home')
        
    else {
            req.flash('warn',"wrong password or username")
            return res.redirect('/');
        }
    } catch(err){
        res.send(err);
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
        return res.redirect('/home')

     } else{
            req.flash('warn',"password not matched")
            return res.redirect('/signup');
    }
})

app.get('/home',async (req,res)=>{
    
    let hisaabs = await hisaabModels.find()
    let mssg = req.flash('warn')
    res.render('home',{hisaabs,mssg})

})

function compare(array){
    
    let newArr=[]
    for (let i = 0; i < array.length; i++) {
        newArr[i] =array[i].createdAt
    }
    let arr = newArr.map( date => date.split('-'))

    for(let j = 0 ; j<3 ;j++){
        for (let i =0; i<((arr.length-1)-j) ; i++){
        if(arr[i][2]>arr[i+1][2]){
            console.log("year bada hai no isuue")
            break;
        }else if(arr[i][2] == arr[i+1][2]){
            console.log("year bara bar hai ")
            if(arr[i][1] > arr[i+1][1]){
                console.log("month bada hai no isuue")
                break;
            }else if(arr[i][1] == arr[i+1][1]){
                console.log("month bara bar hai")
                if(arr[i][0] > arr[i+1][0]){
                    console.log('date badi hai')
                    break;
                } else if(arr[i][0] == arr[i+1][0]){
                    console.log('date same hai')
                    break;
                }else{
                    console.log("date choti hai")
                    let term1 = arr[i]
                    arr[i] =arr[i+1]
                    arr[i+1] = term1 ;
                    let term = array[i]
                    array[i] =array[i+1]
                    array[i+1] = term ;
                    console.log('swaped')
                }
            }else{
                console.log("month chota hai ")
                let term1 = arr[i]
                arr[i] =arr[i+1]
                arr[i+1] = term1 ;
                let term = array[i]
                array[i] =array[i+1]
                array[i+1] = term ;
                
                console.log('swaped')
            }
        }else{
            console.log("year chota hai")
            let term1 = arr[i]
            arr[i] =arr[i+1]
            arr[i+1] = term1 ;
            let term = array[i]
            array[i] =array[i+1]
            array[i+1] = term ;
            console.log('swaped')
        }
    }
    }
    console.log(array);
    
    return array
    
}

app.get('/newFirst',async (req,res)=>{ 
    let hisaab =  await hisaabModels.find()
    let hisaabs = compare(hisaab)

    let mssg = req.flash('warn')
    res.render('home',{hisaabs,mssg})
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

app.post('/encrypt/:id', async (req, res) => {
    try {
        let hisaab = await hisaabModels.findOne({ _id: req.params.id });
        let passcode = parseInt( req.body.passcode);


        console.log(`Comparing passcodes: provided="${passcode}", stored="${hisaab.passcode}"`);

        let ps = passcode === parseInt( hisaab.passcode) ? true : false;
        console.log(ps);
        
        if (ps) {
            console.log('Passcodes matched');
            res.redirect(`/show/${req.params.id}`);
        } else {
            console.log('Passcodes did not match');
            req.flash('warn', 'Wrong passcode');
            res.redirect('/home');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        req.flash('warn', 'An error occurred');
        res.redirect('/home');
    }
});

app.get('/show/:name', async (req, res) => {
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    let mssg = req.flash('warn');
    
    res.render('show',{hisaab,mssg})
    
   
})
app.get('/editcheck/:name' , async (req,res)=>{
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    if(hisaab.edit === true){
        res.redirect(`/edit/${req.params.name}`)
    }
    else{
        req.flash('warn',"this file is non editable");
        res.redirect(`/show/${req.params.name}`)
    }
})
app.get('/edit/:name', async (req,res)=>{
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    res.render('edit',{hisaab});
})
app.post('/update/:_id', async (req, res) => {
    try {
        console.log(`Updating hisaab with _id: ${req.params._id}`);
        let { name, data, encryption, edit, shareable, passcode } = req.body;
        let enc = encryption === 'on';
        let shr = shareable === 'on';
        let ed = edit === 'on';


        let newHisaab = await hisaabModels.findOneAndUpdate(
            { _id: req.params._id },
            {
                name,
                data,
                encryption: enc,
                shareable: shr,
                edit: ed,
                passcode
            },
            { new: true }
        );

        if (!newHisaab) {
            req.flash('warn', 'Hisaab not found');
            return res.redirect('/home');
        }

        res.redirect('/home');
    } catch (err) {
        console.error('Error occurred:', err);
        req.flash('warn', 'An error occurred');
        res.redirect('/home');
    }
});

app.get("/delete/:name", async (req,res)=>{
    await hisaabModels.findOneAndDelete({_id:req.params.name})
    res.redirect('/home')
   
})



app.listen(5001,()=>{
    console.log(`http://localhost:5001`);
})



