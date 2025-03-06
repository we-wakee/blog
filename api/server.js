const express = require('express');
const cors= require('cors');
const mongoose = require('mongoose')
const Buffer = require('safe-buffer').Buffer;
const bcrypt= require('bcrypt')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const userModel = require('./models/User.jsx')
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User.jsx');
const PostModel = require('./models/Post.jsx')
const app = express()
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
}));
app.use(express.json());
const salt = bcrypt.genSaltSync(10);
const secret = '1234';

mongoose.connect('mongodb+srv://mikasa:1234@blog.xhfki.mongodb.net/')

app.listen(5000,()=>{
    console.log("server started")
});

app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    try{
        const userDoc = await UserModel.create({
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
    const userDoc= await UserModel.findOne({username});
   


    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password,userDoc.password);


    if (!passOk) {
        return res.status(400).json({ error: 'Wrong credentials' });
    }

        jwt.sign({username,id:userDoc._id},secret,{},
            (err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username
                });
            }
        );
    
});


app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
    });
    

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
})

app.get('/post',uploadMiddleware.single('file'), (req,res)=>{
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;

        const {title,summary,content} = req.body;

        const postDoc = PostModel.create(
            {
                title,
                summary,
                content,
                cover:newPath,
                author: info.id
            }
        );
        res.json(postDoc);
    })
})

