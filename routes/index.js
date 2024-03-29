/**
 * Lead Author: Eben
 * This file defines the routes for the home page and login.
 *
 * (GET) / - Takes the user to the home page.
 * (POST) /login - Logs the user in.
 * (GET) /logout - Logs the user out
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/**
* Takes the user to the home page.
*
* The request has a GET body.
*
* We handle several errors that might occur when visiting our site.
* We render the login page if the user isn't logged in.
* We redirect the user to their user page if the user is already logged in.
*
*/
router.get('/', function(req, res) {
	var flash = req.flash('error');
	console.log(flash);
	var message = flash != undefined ? flash : null;
	console.log(message);
	//console.log(flash.error);
	if(!req.user) {
		res.render('index', { title: 'Pangaea' , languages: languages, messages: message});
	} else {
		res.redirect('/home/')
	}
});
/**
 * Logs a user in.
 *
 * The request has a POST body that must include a "username" and "password".
 *
 * We use passport which handles the whole process of authentication and logging in.
 *
 * It also sets a session_id cookie.
 */
router.post('/login',
  passport.authenticate('local', { successRedirect: '/home/',
                                   failureRedirect: '/',
                                   failureFlash: true})
);

/**
* Logs a user out.
*
* The request has a GET body.
*
* We use passport which handles the whole process of authentication and logging out.
*
* It also removes the session_id cookie.
*/
router.get('/logout', function(req, res){
	User.findOneAndUpdate({_id: req.user._id}, {isOnline: false}, function(err, user) {
		console.log(user);
	});
  req.logout();
  res.redirect('/');
});

router.get('/test', function(req,res){
	console.log('test');
	res.render('QUnit');
});

module.exports = router;
