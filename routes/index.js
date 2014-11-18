var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
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
