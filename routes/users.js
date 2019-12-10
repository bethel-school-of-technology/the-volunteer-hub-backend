var express = require('express');
var router = express.Router();
const User = require('../models/Users');

//Route for the a user to sign up.
router.post('/signUp', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  user.save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err)
  });
  res.status(201).json({
    message: "You are a new user!",
    createdPost: user
  });
});

module.exports = router;
