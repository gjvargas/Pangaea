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
	var io = req.app.get('io');
	var chat_id = req.params.private_id;
	var obj = {
		title: 'Socket Private Chat',
		online_users: io.sockets.in(chat_id).sockets,
		chat_id: chat_id
	};
	res.render('private_chat',obj);
});

module.exports = router;
