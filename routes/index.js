var express = require('express');
var router = express.Router();
const org = require('../models/Organizations');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');

//NODEMAILER FUNCTION
router.post('/sendMail', function(req,res,next) {
  var orgName = req.body.name;
  //codeburst nodemailer example
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'testnodemailer111@gmail.com',
          pass: 'nodemailerpassword'
      }
  });
  const mailOptions = {
    from: 'testnodemailer111@gmail.com', // sender address
    to: 'elyamurza@yahoo.com', // list of receivers
    subject: 'Thank you for applying!', // Subject line
    html: `<p>Hi there! We appreciate you applying to this position, ${orgName}, they will get in contact with you if they decide to proceed!</p>`// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) {
      console.log(err)
      res.send(404);
    }
    else{      
      console.log(info);
      res.send(200);
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

  org.find({ 'state': state }).then(found => {
    res.send(found);
    console.log(found);
  })
})

//ROUTE FOR GETTING ORGANIZATIONS BY _ID
router.get('/getOrgsTest', function (req, res, next) {
  org.findById(mongoose.Types.ObjectId('5dfdcdee211c0054f3696511')).then(result => {
    console.log(result);
    res.send(result);
  })
});

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

