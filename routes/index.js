var express = require('express');
var router = express.Router();
// const Post = require('../models/Posts');
const mongoose = require('mongoose');

//Code below is used to verify backend - frontend connection
var staticModels = require('../staticModels/posts');

router.get('/staticposts', function (req, res, next) {
  res.send(JSON.stringify(
    staticModels.Post
  ));
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/post', (req, res, next) => {
//   const post = new Post({
//     title: req.body.title,
//     description: req.body.description
//   });
//   post.save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(err)
//   });
//   res.status(201).json({
//     message: "Handling POST requests tp /post",
//     createdPost: post
//   });
// });


module.exports = router;
