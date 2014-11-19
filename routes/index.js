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

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: false }), 
  function(req, res){
  	res.redirect('/users');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

/* Test real-time chat page */
router.get('/chat', function(req, res) {
	var io = req.app.get('io');
	var obj = {
		title: 'Socket Chat Test Page',
		online_users: io.sockets.in('chat').sockets
	};
	res.render('chat', obj);
});

/* Test private chat rooms */
router.get('/private/:private_id', function(req, res) {
	// Redirect if not logged in
	if(!req.user){
		res.redirect('/login');
	} else {
		var io = req.app.get('io');
		var room_id = req.params.private_id;
		var obj = {
			title: 'Socket Private Chat',
			room_id: room_id,
			user: req.user
		};
		res.render('private_chat',obj);
	}
});



module.exports = router;
