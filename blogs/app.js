const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose")

const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
const aboutContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
const contactContent = "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures,"

const app = express();



app.set("view engine" , "ejs")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/postsDB")

const postsSchema = new mongoose.Schema({
    title: String,
    body:String
})

const Post = mongoose.model("post" , postsSchema)

async function findPosts(condition) {
    try {
      const data = await Post.find(condition);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
}

app.get("/", async function(req,res){
    try {
        const posts = await findPosts({});
        res.render("home", {homeContent:homeStartingContent , homePosts:posts});
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
})

app.get("/about", function(req,res){
    res.render("about" , {aboutPageContent:aboutContent});
})

app.get("/contact", function(req,res){
    res.render("contact" , {contactPageContent:contactContent});
})

app.get("/compose", function(req,res){
    res.render("compose");
})

app.post("/compose" , function(req,res){
    titleText = req.body.titleText;
    bodyText = req.body.bodyText;

    const post= new Post({
        title: titleText,
        body: bodyText
    });

    post.save();

    res.redirect("/")
})

app.get("/posts/:postId" , async function(req,res){
    const requestedPostId = req.params.postId;

    try {
        const post = await findPosts( {_id:requestedPostId});
        res.render("posts", {posttitle:post[0].title , postbody: post[0].body});

      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }

})

app.listen(3000, function(){
    console.log("running on port 3000")
})