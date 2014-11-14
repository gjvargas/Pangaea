var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* Test real-time chat page */
router.get('/chat', function(req, res) {
	res.render('chat', { title: 'Socket Chat Test Page'})
});

module.exports = router;
