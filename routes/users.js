// author: Eben Bitonte

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user.js');

/*
	Displays homepage of current user if they are logged
	into Pangaea
*/
router.get('/', function(req, res) {
	if(req.user) {
		// res.render('users/', {title: "Pangaea", user: req.user});
		res.redirect('/exchanges');
	} else {
		res.redirect('/');
	}
});

/*
	Creates new user-

	Registers them in passports/mongodb and logs them in-
		*handles errors regarding bad username/email/password
*/
router.post('/create', function(req, res) {
	var new_user = new User({
		username : req.body.username,
		email : req.body.email,
		password : req.body.password,
		proficiencies : req.body.languages
	});

	User.register(new_user, req.body.password, function(err, user) {
		if(err) {
			req.flash('error', err.message);
			res.redirect('/');
		} else {
			passport.authenticate('local')(req, res, function() {
				res.redirect('/users/');
			});
		}
	});
});

module.exports = router;
