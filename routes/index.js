var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Pangaea' });
});

router.get('/login', function(req, res) {
	res.render('login', {title : "Login"});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/users/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

module.exports = router;
