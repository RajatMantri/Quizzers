
import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 4000;

app.use(express.static("public/styles"));
// In-memory data store
let posts = [];
let lastId = 0;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET All posts
app.get("/posts",(req,res)=>{
res.json(posts);
});

//GET a specific post by id
app.get("/posts/:id",(req,res)=>{
  const id=parseInt(req.params.id);
  const reqPost = posts.find((element)=>element.id===id);
  res.json(reqPost);
});

// POST a new post
app.post("/posts",(req,res)=>{
const newPost={
  id:++lastId,
  title:req.body.title,
  tf: req.body.tf || null,
  content:req.body.content || null,
  mcq: req.body.mcq || null,
  mcq1: req.body.mcq1 || null,
  mcq2: req.body.mcq2 || null,
  mcq3: req.body.mcq3 || null,
  mcq4: req.body.mcq4 || null
} 
console.log("req.body");
console.log(req.body);
console.log("/posts(newPost)");
console.log(newPost);
posts.push(newPost);
res.json(newPost);
});

// app.get("/createQuiz",(req,res)=>{
// res.render("C:\\Users\\hp\\Downloads\\WEBSTER\\DashBoard\\Admin\\createQuiz\\views\\index.ejs");
// });

// PATCH a post when you just want to update one parameter

app.patch("/posts/:id",(req,res)=>{
  const id=parseInt(req.params.id);
  const existingPost= posts.find((element)=>element.id === id);
  // console.log(existingPost);
  const newPost={
    Username: req.body.Username,
    id:id,
    title:req.body.title || existingPost.title,
    content:req.body.content || existingPost.content,
    tf: req.body.tf || existingPost.tf || null,
    mcq: req.body.mcq || existingPost.mcq|| null,
    mcq1: req.body.mcq1 || existingPost.mcq1|| null,
    mcq2: req.body.mcq2 || existingPost.mcq2|| null,
    mcq3: req.body.mcq3 || existingPost.mcq3|| null,
    mcq4: req.body.mcq4 || existingPost.mcq4|| null
  }
  
  const searchIndex = posts.findIndex((element)=>element.id===id);
  posts[searchIndex]=newPost;
  console.log(newPost.Username);
  res.json(newPost);
  });

// DELETE a specific post by providing the post id.

app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

// SUBMIT
app.get("/posts/:id",(req,res)=>{
  posts=[];
  res.json(posts);
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
