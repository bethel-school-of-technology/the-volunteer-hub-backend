var express = require('express');
var router = express.Router();
const User = require('../models/Users');
const authService = require('../services/auth');

//Route for the a user to sign up.
router.post('/signUp', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: authService.hashPassword(req.body.password)
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

//Route for loggin a user in.

module.exports = router;
