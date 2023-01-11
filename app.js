const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema={
    title: String,
    content: String
}

const Article = mongoose.model("Article",articleSchema);

app.route("/articles").get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
        res.send(foundArticles);
    }
        else{
            res.send(err);
        }
    });
}).post(function(req,res){

    const newArticle = new Article({
       title:req.body.title,
       content: req.body.content
    });
    newArticle.save(function(err){
       if(!err){
           res.send("successfully added a new article");
       }
       else{
           res.send(err);
       }
    });
   }).delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all articles");
        }
        else{
            res.send(err);
        }
    })
});

app.route("/articles/:articleTitle")
.get(function(req,res){
   
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }
        else{
            res.send("No articles matching that title was found.")
        }
    });
})
.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title , content : req.body.content},
        {overwrite: true},
        function(err,result){
            if(!err){
                res.send("succesfully updated article");
            }
            else{
                res.send("an error occured");
            }
        }
    )
});
    




app.listen(3000,function(){
    console.log("server started on port 3000");
})