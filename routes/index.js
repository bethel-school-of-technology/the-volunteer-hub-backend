var express = require('express');
var router = express.Router();
const org = require('../models/Organizations');
const user = require('../models/Users');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');

//NODEMAILER FUNCTION
router.post('/sendMail', function (req, res, next) {
  var orgEmail = req.body.email;
  var applicantName = req.body.applicant;
  var applicantContact = req.body.contact;
  var orgName = req.body.orgName;

  //Establish transport, service, and user and password that emails will be sent from
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thevolunteerhub.system@gmail.com',
      pass: 'volunteerhubpassword'
    }
  });
  const mailOptions = {
    from: 'testnodemailer111@gmail.com', // sender address
    to: orgEmail, // list of receivers
    subject: 'Someone applied to your organization!', // Subject line
    html: `<p>Hi there! We we are reaching out to let you know that, ${applicantName}, has applied to volunteer at your organization ${orgName}! Feel free to contact them and schedule some hours at ${applicantContact}!</p>` // plain text body
  };

  //Transporter sends mail
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
      res.status(404).json({
        message: "Error applying"
      });
    } else {
      console.log(info);
      res.status(200).json({
        message: "You have successfully applied!"
      });
    }
  });
});

//ROUTE FOR GETTING ALL ORGANIZATIONS IN THE DATABASE
router.get('/getOrgs', function (req, res, next) {
  org.find()
    .then(result => {
      console.log(result);
      res.send(result);
    })
});

//ROUTE FOR GETTING ORGANIZATIONS BY SEARCH QUERY
router.get('/getOrgs/:state', function (req, res, next) {
  var state = req.params.state;
  org.find({
    'state': state
  }).then(found => {
    res.send(found);
    console.log(found);
  })
})


//ROUTE FOR GETTING ALL USERS FOR THE ADMIN PAGE
router.get('/getUsers', function (req, res, next) {
  user.find()
    .then(result => {
      console.log(result);
      res.send(result);
    })
});


//ROUTE FOR GETTING ORGANIZATIONS BY _ID
router.get('/getOrgById/:id', function (req, res, next) {
  org.findById(req.params.id).then(result => {
    console.log(result);
    res.send(result);
  }).catch(err => {
    if (err) {
      console.log(err);
    }
  });
});


module.exports = router;