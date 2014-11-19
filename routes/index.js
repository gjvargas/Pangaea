// Author: Eben Bitonte

var express = require('express');
var router = express.Router();
var passport = require('passport');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/*
	Get home page with login and create new user

	If reached this page through error previously logging in or
	creating a new user, that error is displayed
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
		res.redirect('/users/')
	}
});

/*
	Login route

	Logs in current user through passport-
		* creates a session as well
		* handles errors of logging in (i.e. wrong password)
*/
router.post('/login',
  passport.authenticate('local', { successRedirect: '/users/',
                                   failureRedirect: '/',
                                   failureFlash: true})
);

/*
	Logout route

	Logs out of passport-
		* handles removal of cookies/session
		* redirects to login page
*/
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
