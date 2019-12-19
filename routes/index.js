var express = require('express');
var router = express.Router();
const org = require('../models/Organizations');



//Code below is used to verify backend - frontend connection
// var staticModels = require('../staticModels/posts');

// router.get('/staticposts', function (req, res, next) {
//   res.send(JSON.stringify(
//     staticModels.Post
//   ));
// });

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

  org.find({ 'state' : state }).then(found => {
    res.send(found);
  })
})

module.exports = router;

