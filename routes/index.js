var express = require('express');
var router = express.Router();
var passport = require('passport');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/* GET home page. */
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

router.get('/login', function(req, res) {
	res.render('login', {title : "Login"});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/users/',
                                   failureRedirect: '/',
                                   failureFlash: true})
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
