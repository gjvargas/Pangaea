/**
* Lead Author: Eben
* This file defines the routes for the user page.
*
* (GET) /users - Takes the user to their user page.
* (POST) /users/create - Creates an account for the user and logs them in.
*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user.js');

/**
* Takes the user to their user page.
*
* The request has a GET body.
*
* We render the user page if the user is already logged in.
* We redirect to the login page if the user isn't logged in.
*
*/
router.get('/', function(req, res) {
	if(req.user) {
		// res.render('users/', {title: "Pangaea", user: req.user});
		if(!req.user.isOnline) {
			User.findOneAndUpdate({_id: req.user._id}, {isOnline: true}, function(err, user) {
				console.log(user);
			});
		}
		res.redirect('/exchanges');
	} else {
		res.redirect('/');
	}
});

/**
* Creates an account for the user.
*
* The request has a POST body that takes a username, email, password, and
* the languages that the user is proficient in.
*
* We handle any potential errors that may arise.
* We use passport to register the account.
* Passport handles all the authentication for us.
*
*/
router.post('/create', function(req, res) {
	var new_user = new User({
		username : req.body.username,
		email : req.body.email,
		password : req.body.password,
		proficiencies : req.body.languages,
		desires : req.body.interests
	});

	User.register(new_user, req.body.password, function(err, user) {
		if(err) {
			var message = err.message;
			if(err.name === "ValidationError") {
				for(key in err.errors) {
					message = err.errors[key].message;
					break;
				}
			} else if(err.code === 11000) {
				message = "Email already in use";
			}
			req.flash('error', message);
			res.redirect('/');
		} else {
			passport.authenticate('local')(req, res, function() {
				res.redirect('/home/');
			});
		}
	});
});

router.post('/edit', function(req, res) {
	console.log('edit user');
	console.log(req);
	console.log(req.body);
	var update = req.body;
	console.log(update.proficiencies);
	if(!req.user) {
		res.redirect('/');
	} else {
		update = {
			proficiencies: req.body.proficiencies,
			desires: req.body.desires
		};
		User.findOneAndUpdate({_id: req.user._id}, update, function(err, result) {
			if(err) {
				res.status(400).send({message: "Couldn't update your profile."});
			} else {
				res.send({proficiencies: result.proficiencies, desires: result.desires});
			}
		});
	}
});

module.exports = router;
