const express = require('express');
const cors= require('cors');
const mongoose = require('mongoose')
const Buffer = require('safe-buffer').Buffer;
const bcrypt= require('bcrypt')
const fs = require('fs');
const jwt = require('jsonwebtoken');


const app = express()
app.use(express.json()); 
app.use(cors()); 
app.use(express.json());
const salt = bcrypt.genSaltSync(10);
const secret = '1234';

mongoose.connect('mongodb+srv://mikasa:1234@blog.xhfki.mongodb.net/')

app.listen(4000,()=>{
    console.log("server started")
});

app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    try{
        const userDoc = await create({
            username,
            password:bcrypt.hashSync(password,salt)
        })
        res.json(userDoc);
    }catch(e){
        console.log(e);
        res.status(400).json(e);
    }

})



app.post('/login',async (req,res)=>{
    const{username,password} = req.body;
    const userDoc= await User.findOne({username});
    const passOk = bcrypt.compareSync(password,userDoc.password);

    if(passOk){
        jwt.sign({username,id:userDoc._id},secret,{},
            (err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username
                });
            }
        );
    }else{
        res.status(400).json('wrong credentials')
    }
});


app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
    });
    
