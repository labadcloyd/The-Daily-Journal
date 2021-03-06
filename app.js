const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
require('dotenv').config();

const _ = require('lodash');
const { kebabCase } = require("lodash");

let mongoServerPassword = process.env.MONGO_SERVER_PASSWORD
mongoose.connect(process.env.MONGODB_URL||'mongodb+srv://admin-cloyd:'+mongoServerPassword+'@todo-app.0pmsv.mongodb.net/blogSite?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);

const articleSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  date:{
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});
const article = mongoose.model('article', articleSchema)


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});


app.get('/', (req,res)=>{
  article.find((err,article)=>{
    res.render('home.ejs',{
      article: article,
      defaultContent: homeStartingContent,
    })
  })
})
app.get('/about', (req,res)=>{
  res.render('about.ejs', {
    aboutContent: aboutContent,
  })
})
app.get('/contact', (req,res)=>{
  res.render('contact.ejs', {
    contactContent: contactContent,
  })
})
app.get('/compose', (req,res)=>{
  res.render('compose.ejs')
})
app.post('/compose', (req,res)=>{
  article.insertMany({
    title: req.body.titleContent,
    date: req.body.dateContent,
    content: req.body.content,
  });
  res.redirect('/');
})
const options = { year: 'numeric', month: 'long', day: 'numeric' };
app.get('/posts/:topic',(req,res)=>{
  let reqtitle = req.params.topic;
  article.findOne({_id: reqtitle},(err, article)=>{
        if(!err){
          res.render('post.ejs', {
            title: article.title,
            date: article.date.toLocaleDateString('en-US',options),
            content: article.content,
          })
        }
        if(err){
          console.log(err);
          res.redirect('/')
        }
  })  
});

