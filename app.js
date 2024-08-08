const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

///////////////////////////////////////// Requests Targetting all Articles ////////////////////////////////////

app.route("/articles")
  .get(function (req, res) {
    Article.find()
      .then((articles) => {
        if(articles.length===0){
            res.send("No data available.")
        }else{
            res.send(articles);
        };
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save()
      .then(() => {
        res.send("Success.");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany()
    .then(()=>{
        res.send("Successfully deleted.");
    })
    .catch((err) => {
      console.error(err);
    });
});

///////////////////////////////////////// Requests Targetting a Specific Articles ////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle})
    .then((article) =>{
        if(!article){
            res.send("No record found.");
        }else{
            res.send({title:article.title, content:article.content});
        }
    })
    .catch((err)=>{
        res.send(err);
    })
})
.put(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.findOneAndUpdate({title: articleTitle},{title: req.body.title ,content: req.body.content})
    .then(()=>{
        res.send("Successfully updated a specific article.")
    })
    .catch((err)=>{
        res.send(err);
    })
})
.patch(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.findOneAndUpdate(
        {title: articleTitle},
        {$set : req.body})
    .then(()=>{
        res.send("Successfully updated a specific article.")
    })
    .catch((err)=>{
        res.send(err);
    })
})
.delete(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({title: articleTitle})
    .then(()=>{
        res.send("Specific article deleted.")
    })
    .catch((err)=>{
        res.send(err);
    })
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
