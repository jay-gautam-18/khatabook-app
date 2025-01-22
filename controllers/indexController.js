const compare = require('../utils/compare')
const userModels =require('../models/user.models');
const hisaabModels = require('../models/hisaab.models');
module.exports.indexController = (req,res)=>{
    let warns = req.flash('warn')
    res.render('login',{warns})
}
module.exports.loginController =  async (req,res)=>{
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
}
module.exports.signupController = (req,res)=>{
    let mssg = req.flash('warn')
    res.render('signup',{mssg})
}
module.exports.signupController2 =  async (req,res)=>{
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
}
module.exports.homeController =async (req,res)=>{
    
    let hisaabs = await hisaabModels.find()
    let mssg = req.flash('warn')
    res.render('home',{hisaabs,mssg})

}

module.exports.newFirst = async (req,res)=>{ 
    let hisaab =  await hisaabModels.find()
    let hisaabs = compare(hisaab)

    let mssg = req.flash('warn')
    res.render('home',{hisaabs,mssg})
}
module.exports.createController = (req,res)=>{
    res.render('create')
}
module.exports.createController2 =async (req,res)=>{
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

}
module.exports.encrypt =  async (req, res) => {
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
}
module.exports.editcheck = async (req,res)=>{
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    if(hisaab.edit === true){
        res.redirect(`/edit/${req.params.name}`)
    }
    else{
        req.flash('warn',"this file is non editable");
        res.redirect(`/show/${req.params.name}`)
    }
}
module.exports.show =  async (req, res) => {
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    let mssg = req.flash('warn');
    
    res.render('show',{hisaab,mssg})
    
   
}
module.exports.edit = async (req,res)=>{
    let hisaab = await hisaabModels.findOne({_id:req.params.name})
    res.render('edit',{hisaab});
}
module.exports.update = async (req, res) => {
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
}
module.exports.deleteController =async (req,res)=>{
    await hisaabModels.findOneAndDelete({_id:req.params.name})
    res.redirect('/home')
   
}