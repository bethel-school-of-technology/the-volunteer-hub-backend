var express = require('express');
var router = express.Router();
const org = require('../models/Organizations');
var mongoose = require('mongoose');


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

