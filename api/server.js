const express = require('express');
const cors= require('cors');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
require('dotenv').config()
const Buffer = require('safe-buffer')
const bcrypt= require('bcrypt')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const userModel = require('./models/User.jsx')
const cookieParser = require('cookie-parser');
const PostModel = require('./models/Post.jsx')
const app = express()
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

app.use(express.json()); 
app.use(cookieParser());

const allowedOrigin = process.env.FRONTEND_URL 

app.use(cors({
    origin: allowedOrigin, // Allow only your frontend
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP mecthods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;


mongoose.connect(process.env.MONGODB_URL).
then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error))


app.listen(process.env.PORT,()=>{
    console.log("server started")
}); 

function authenticateToken(req, res, next) {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "JWT token missing" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}




app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    try{
        const userDoc = await userModel.create({
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
    const userDoc= await userModel.findOne({username});
   


    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password,userDoc.password);


    if (!passOk) {
        return res.status(400).json({ error: 'Wrong credentials' });
    }

    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {
            httpOnly: true,  // ✅ Prevents client-side access
            secure: true,    // ✅ Works only on HTTPS (remove for local dev)
            sameSite: "none" // ✅ Required if frontend & backend are on different domains
        }).json({
            id: userDoc._id,
            username
        });
    }); 
});


app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
    });
    

app.get('/profile', authenticateToken,(req, res) => {
        const { token } = req.cookies;
    
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
    
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired token" });
            }
            res.json(info);
        });
});


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


app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await PostModel.findById(id);

      if (!postDoc) {
        return res.status(404).json({ message: "Post not found" });
        }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;

          await postDoc.save();   
      res.json(postDoc);
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



app.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await PostModel.findById(id).populate('author', ['username']);
        
        if (!postDoc) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        res.json(postDoc);
    } catch (error) {
        console.error('error dengindi', error );
        res.status(500).json({ error: "Error fetching post" });
    }
});