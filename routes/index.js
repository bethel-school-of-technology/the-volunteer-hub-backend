var express = require('express');
var router = express.Router();
const Post = require('../models/Posts');

//Code below is used to verify backend - frontend connection
var staticModels = require('../staticModels/posts');

router.get('/staticposts', function (req, res, next) {
  res.send(JSON.stringify(
    staticModels.Post
  ));
});


// This route is for testing purposes via Postman
router.post('/post', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });
  post.save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err)
    });
  res.status(201).json({
    message: "This is your new post!",
    createdPost: post
  });
});


module.exports = router;
