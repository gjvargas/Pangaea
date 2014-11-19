var express = require('express');
var router = express.Router();
var passport = require('passport');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/* GET home page. */
router.get('/', function(req, res) {
	if(!req.user) {
		res.render('index', { title: 'Pangaea' , languages: languages});
	} else {
		res.redirect('/users/')
	}
});

router.get('/login', function(req, res) {
	res.render('login', {title : "Login"});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/users/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
