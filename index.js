const express = require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const blogPostArray = require("./data");
require("dotenv").conflig();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

const mongodbURL=process.env.MONGO_URL;

mongoose.connect(mongodbURL)
.then(()=>{ 
console.log("DB connected successfully");
})
.catch((err)=>{ 
    console.log("error occured at DB connection",err);
});


const blogSchema =new mongoose.Schema({
    title:String,
    imageURL:String,
    description:String
});

const Blog=new mongoose.model("blog",blogSchema);

app.get("/", (req, res)=>{
    Blog.find({})
    .then((arr)=>{ 
        res.render("index", {blogPostArray: arr})
        })
        .catch((err)=>{ 
            console.log("cannot find blogs");
            res.render("404");
        });
    
    
    
})

app.get("/compose", (req, res)=>{
    res.render("compose")
})

app.post("/compose",(req,res)=>{
    
    const image=req.body.imageUrl;
    const title=req.body.title;
    const description=req.body.description;


    const newBlog=new Blog({
        imageURL:image,
        title:title,
        description:description


    })

    newBlog.save()
    .then(()=>{ 
        console.log("blog posted successfully");
        })
        .catch((err)=>{ 
            console.log("error posting new blog");
        });
    
res.redirect("/")


})
app.get("/post/:id", (req, res)=>{
    console.log(req.params.id);

    let id=req.params.id;
    let title="";
    let imageURL="";
    let description="";
    blogPostArray.forEach(post =>{
        if(post._id==id){

        title=post.title;
        imageURL=post.imageURL;
        description=post.description;

        }
    });


     const post={
        title:title,
        imageURL:imageURL,
        description:description
     }


    res.render("post",{post:post})
})

app.get("/about", (req, res)=>{
    res.render("about")
})

app.get("/contact", (req, res)=>{
    res.render("contact")
})

const port=3000 || process.env.PORT;

app.listen(port, ()=>{
    console.log("Server is listening on port 3000");
})