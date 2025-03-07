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
app.use('/uploads', express.static(__dirname + '/uploads'));
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


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    
    // Rename the file to include its extension
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    
    // Verify JWT token
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract post data
        const { title, summary, content } = req.body;

        if (!title || !summary || !content) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Create the post document in the database
            const postDoc = await PostModel.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id
            });

            // Respond with the newly created post
            res.json(postDoc);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Error creating post' });
        }
    });
});


app.get('/post',async (req,res)=>{
    res.json(
        await PostModel.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    )
})

// app.get('post/:id',async (req,res)=>{

//     const id=req.params;
//     const PostDoc = await Post.findById(id).populate('author', ['username']);
//     res.json(PostDoc);
// })