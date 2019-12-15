var express = require('express');
var router = express.Router();
var User = require('../models/Users');
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

//Route for a user to  login.
router.post('/login', function (req, res, next) {
  User.findOne({
      'username': req.body.username
    })
    .then(user => {
      if (!user) {
        console.log("User not found.");
        res.status(401).json({
          message: "Login failed."
        });
      } else {
        let passwordMatch = authService.comparePasswords(req.body.password, user.password);
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie('jwt', token);
          console.log(user);
          console.log(token);
        } else {
          console.log("Wrong password!");
        }

        return res.status(200).send();
      }
    })
});


module.exports = router;