var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user.js');

router.get('/', function(req, res) {
	res.render('users/', {title: "Pangaea", user: req.user});
});

/* GET users listing. */
router.get('/new', function(req, res) {
  	res.render('users/new', {title:'Add New User'});
});

router.post('/create', function(req, res) {
	console.log("making new user");
	console.log(req.body.languages);
	var new_user = new User({
		username : req.body.username,
		email : req.body.email,
		password : req.body.password,
		proficiencies : req.body.languages
	});

	User.register(new_user, req.body.password, function(err, user) {
		if(err) {
			res.send(err);
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/users/');
		});
	});
});

module.exports = router;
