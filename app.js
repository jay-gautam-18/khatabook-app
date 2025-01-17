const { render } = require('ejs');
const express = require('express')
const app = express();
const fs = require('fs')

app.set('view engine' ,'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        if (err) return res.send(err);
        res.render('home',{files})
    })

})

app.get('/create',(req,res)=>{
    res.render('create')
})
app.post('/create',(req,res)=>{
    const currentDate = new Date();
    const day = currentDate.getDate()
    const month = currentDate.getMonth()+1
    const year = currentDate.getFullYear()
    const dt = `${day}-${month}-${year}`

    fs.writeFile(`./files/${req.body.filename + "." +dt}.txt`,req.body.filedata,(err)=>{
        if (err) return res.send(err);
            else res.redirect('/');
    })
    
})
app.get('/show/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,data)=>{
        if (err) return res.send(err);
        else res.render('show',{data,filename:req.params.filename})
    })
})

app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,data)=>{
        if (err) return res.send(err);
        else res.render('edit',{data , filename:req.params.filename});
    })
})
app.post('/update/:filename',(req,res)=>{
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata ,(err)=>{
        console.log("updated");
        if(err) return res.send(err);
        res.redirect('/');
    })
})

app.get("/delete/:filename",(req,res)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        if(err) return res.send(err);
        res.redirect('/');
        console.log("deleted");
    })
})



app.listen(5001,()=>{
    console.log("Server is running on port 5001");
})