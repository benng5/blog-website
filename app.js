//jshint esversion:6

//Adding library to Javascript
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//Including Lodash library
const _ = require("lodash");
//Adding mongoose library
const mongoose = require("mongoose");

//mongoose.connect("mongodb+srv://admin-ben:Test123@cluster0.qlhnglx.mongodb.net/personalBlog");
mongoose.connect("mongodb://localhost:27017/personalBlog");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Creating Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  content: String
});

//Creating a Post collection followed postSchema
const Post = mongoose.model("Post", postSchema);

/**
 * Function to handle GET request from root route
 */
app.get("/", function(req, res) {
  //Finding all existing posts in Post(s) collections
  Post.find({}, function(err, result) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("home", {
        startingContent: homeStartingContent,
        //Passing the result array to ejs postContent variable
        postContent: result
      });
    }
  });
});

/**
 * Function to handle GET request by using
 * Route Parameters that take a parameter in path.
 */
app.get("/post/:postName", function(req, res) {
  let matchFound = false;
  Post.find({}, function(err, result) {
    if (err) {
      console.log(err);
    }

    else {
      //Looping through the result array
      result.forEach(function(element) {
        //Checking if a route parameter exists.
        if (req.params.postName === element._id.valueOf()) {
          console.log("Match Found!!!");
          matchFound = true;

          //Rendering the existing page followed the route parameter.
          res.render("post", {
            title: element.title,
            content: element.content
          });
        }
      });

      if(!matchFound) {
        res.redirect("/compose");
      }
    }
  });
});

/**
 * Functions to handle GET request.
 */
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContentPage: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContentPage: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

/**
 * Function to handle POST request.
 */
app.post("/compose", function(req, res) {
  const newPost = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  newPost.save();

  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
