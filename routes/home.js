var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

router.get('/', function(req, res) {
  if(!req.user){
    res.redirect('/');
  } else {
    User.find(function(err, users){

      // Find the exchanges which include that user
      Exchange
        .find({ 'users': req.user._id })
        .populate('users')
        .exec(function(err, exchanges){
          var user_languages = languages.filter(function(i) { return req.user.proficiencies.indexOf(i) < 0;});
          var obj = {
          	title: 'Pangaea',
            user: req.user,
            exchanges: exchanges,
            languages: user_languages,
            allLanguages : languages
          };
          res.render('home/', obj);
        });
    });
  }
});

router.post('/create_exchange', function(req, res) {
	var exchanges;
	Exchange.find({users : req.user._id}).exec(function(err, results) {
		if(err) {
			res.status(400).send({message: 'Error retrieving exchanges'});
		} else {
			exchanges = results;
		}
	});

	console.log("creating exchange");
  	User.find({"$and": [
  		{proficiencies: req.body.language},
  		{desires: { "$in" : req.user.proficiencies}}
  	]})
    .exec(function(err, users) {
      console.log('users: ', err, users);
      if(users.length == 0) {
      	console.log('do something');
      	res.status(400).send({message: 'No users could be found who matched your specified languages. Try a different language to learn.'});
      } else {
      	users = shuffle(users);
      	for(var i = 0; i < users.length; ++i) {
      		for(var exg = 0; exg < exchanges.length; ++exg) {
      			if(exchanges[exg].users.indexOf(users[i]._id) >= 0) {
      				if(i == users.length - 1) {
        				res.status(400).send({message: 'An exchange already exists with every user of your very special combination.'});
        			} else {
        				continue;
        			}
        		} else {
        			var other_user = users[i];
        			var matchingLanguages = req.user.proficiencies.filter(function(i) { return other_user.proficiencies.indexOf(i) <0;});
			        matchingLanguages = shuffle(matchingLanguages);
			        var exchange = new Exchange({
			          users : [other_user._id, req.user._id],
			          request : req.body.language,
			          proficiency : matchingLanguages[0]
			        });
			        exchange.save(function(err, exchange){
			          if(err){
			            console.log(err);
			          } else {
			          	console.log(exchange);
			            res.send({exchange: exchange._id});
			          }
			        });
        		}
        	}
      	}
      }
  });
});

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

module.exports = router;