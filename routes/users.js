var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var mongoose = require('mongoose');

router.get('/', function(req, res) {
	res.send("success");
});

/* GET users listing. */
router.get('/new', function(req, res) {
  res.render('users/new', {title:'Add New User'});
});

router.post('/create', function(req, res) {
	console.log("making new user");
	var new_user = new user.User({
		username : req.body.username,
		email : req.body.email,
		password : req.body.password
	});
	console.log("user", user);
	console.log(new_user);

	new_user.save(function(err, product) {
		if(err) {
			res.send('success')
		} else {
			res.redirect('/users/')
		}
	});
	//res.redirect('/users/');
		// function(err, product) {
		// console.log(err);
		// console.log('here', user);
		// res.send('sucess');
		// if(err) {
		// 	res.redirect('/users/new/');
		// } else {
		// 	req.logIn(user, function(err) {
  // 				if (err) console.log(err);
  // 				// login success!
  // 				res.redirect('/users/'); // or whereever
		// 	});
		// }
	//});
});

module.exports = router;
