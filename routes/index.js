var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

/* Blog home page */
router.get('/', function(req, res, next) {
var db = req.db;
var posts = db.get('posts');
posts.find({},{},(err, posts)=>{
res.render('index',{
'posts': posts
    });
  });
});

module.exports = router;
