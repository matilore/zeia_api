const express = require('express');
const router = express.Router();

// User model
const User = require('../models/user');

//Bcrypt let us encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//JSON Web Tokens
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtOptions');

// find user by token
router.post('/', function(req, res, next) {
  let userId = jwt.verify(req.body.token, 'ironhack').id;

  User.findById({ _id: userId }, (err, user) => {
    if (err) {
      throw err;
    }
    console.log(user);
    res.json({ user });
  });
});

/* GET home page. */
router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'This username already exists' });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        var payload = { id: user._id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ message: 'ok', token, user });
        // res.status(200).json(user);
      }
    });
  });
});

//login
router.post('/signin', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    res.status(401).json({ message: 'Field can not be empty' });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (!user) {
      res.status(401).json({
        message: 'User does not exist'
      });
    } else {
      // bcrypt.compare(password, user.password, function(err, isMatch) {
      //   if (!isMatch) {
      //     res.status(401).json({ message: 'Password is incorrect' });
      //   } else {
      //     var payload = { id: user._id };
      //     var token = jwt.sign(payload, jwtOptions.secretOrKey);
      //     res.status(200).json({ message: 'ok', token, user });
      //   }
      // });
      if (user.password !== password) {
        res.status(401).json({ message: 'Password is incorrect' });
      } else {
        var payload = { id: user._id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ message: 'ok', token, user });
      }
    }
  });
});

module.exports = router;
