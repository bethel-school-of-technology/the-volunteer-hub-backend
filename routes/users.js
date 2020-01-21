var express = require("express");
var router = express.Router();
var User = require("../models/Users");
const authService = require("../services/auth");
const Org = require("../models/Organizations");
var ObjectId = require("mongodb").ObjectId;

//ROUTE FOR A NEW USER TO SIGNUP.
router.post("/signup", (req, res, next) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: authService.hashPassword(req.body.password),
    admin: false
  });
  user
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        res.send("User already exists.");
        console.log("User already exists.", err);
      } else {
        res.status(201).json({
          message: "You are a new user!",
          createdPost: user
        });
        res.render("login");
      }
    });
});

//ROUTE FOR A USER TO LOGIN.
router.post("/login", function(req, res, next) {
  User.findOne({
    username: req.body.username
  }).then(user => {
    if (!user) {
      console.log("User not found.");
      return res.status(401).json({
        message: "Login failed."
      });
    } else {
      let passwordMatch = authService.comparePasswords(
        req.body.password,
        user.password
      );
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie("jwt", token);
        return res.status(201).json({
          message: "You are logged in.",
          token: token,
          user: user
        });
      } else {
        console.log("Wrong password!");
        return res.status(401).json({
          message: "Login failed."
        });
      }
    }
  });
});

//ROUTE TO RETRIEVE THE CURRENTLY LOGGED IN USER'S INFO FOR THEIR PROFILE PAGE
router.get("/userProfile", function(req, res, next) {
  let token = req.cookies.token;
  console.log(token);
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        User.findOne({
          username: user.username
        })
          .then(user => {
            console.log(user);
            res.send(user);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  } else {
    res.send("must be logged in");
    console.log("You must be logged in.");
  }
});

//ROUTE TO GET ORGANIZATION FOR PROFILE PAGE
router.get("/userOrgs", function(req, res, next) {
  let token = req.cookies.token;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        Org.find({
          username: user.username
        })
          .then(org => {
            console.log(org);
            res.send(org);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  } else {
    res.send("must be logged in");
  }
});

//ROUTE FOR A REGISTERED USER TO CREATE AN ORGANIZATION
router.post("/createOrg", function(req, res, next) {
  let token = req.cookies.token;
  console.log(token);
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        const org = new Org({
          username: user.username,
          name: req.body.name,
          city: req.body.city,
          state: req.body.state,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          description: req.body.description
        });
        org
          .save()
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json({
                message: "Your organization has been posted.",
                createdOrg: org
              });
            }
          });
      }
    });
  } else {
    res.send("You must be logged in.");
    console.log("You must be logged in.");
  }
});

//ROUTE TO COMPARE ORGANIZATION AND USER
router.post("/compareUser", function(req, res, next) {
  let token = req.cookies.token;
  let id = req.body._id;
  let user = req.body.user;
  if (token) {
    Org.findById(id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Could not find Organization"
        });
      } else {
        User.findOne({ username: user }).then(user => {
          if (!user) {
            return res.status(401).json({
              message: "Are you sure you exist?"
            });
          } else {
            if (user.username == result.username) {
              return res.status(200).json({
                message: "All good!"
              });
            }
          }
        });
      }
    });
  } else {
    return res.status(404).json({
      message: "You must be logged in"
    });
  }
});

//ROUTE TO CHECK WHO IS CURRENT USER
router.get("/getUser", function(req, res, next) {
  let token = req.cookies.token;
  if (token) {
    authService.verifyUser(token).then(user => {
      return res.status(200).json({
        user: user
      });
    });
  } else {
    return false;
  }
});

//ROUTE FOR A USER TO EDIT ONE OF THEIR ORGANIZATIONS
router.patch("/updateOrg/:orgId", function(req, res, next) {
  Org.findOneAndUpdate(
    {
      _id: req.params.orgId
    },
    req.body,
    {
      new: true
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (!result) {
        res.status(201).json({
          message: "Organization was not updated."
        });
      } else {
        res.status(201).json({
          message: "Your organization has been updated.",
          updatedOrganization: result
        });
        console.log(result);
      }
    }
  );
});

//ROUTE FOR A USER TO DELETE ONE OF THEIR ORGANIZATIONS
router.delete("/deleteOrg/:orgId", function(req, res, next) {
  Org.findByIdAndDelete(req.params.orgId, (err, deleted) => {
    if (err) {
      console.log(err);
    } else {
      console.log("This organization has been deleted.", deleted);
      res.status(200);
    }
  });
});

//ROUTE FOR AN ADMIN USER TO DELETE AN ORGANIZATION
router.delete("/admin/deleteOrg/:id", function(req, res, next) {
  Org.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) {
      console.log(err);
    } else {
      console.log("This organization has been deleted:", deleted);
      return res.status(200).json({
        message: "Success"
      });
    }
  });
});

//ROUTE FOR AN ADMIN USER TO DELETE AN ORGANIZATION REPRESENTATIVE
router.delete("/admin/deleteUser/:id", function(req, res, next) {
  User.findByIdAndDelete(req.params.id, (err, deleted) => {
    if (err) {
      console.log(err);
    } else {
      console.log("This organization represetative has been deleted:", deleted);
      return res.status(200).json({
        message: "Success"
      });
    }
  });
});

module.exports = router;
