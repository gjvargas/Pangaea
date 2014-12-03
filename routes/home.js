/*
 * This file defines the routes for exchanges.
 *
 * (GET) /home/ - Takes the user to the home page.
 * (POST) /home/create_exchange - Creates an exchange for the user.
 *
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/*
 * (GET) /home/ - Takes the user to the home page.
 *
 * The request has a GET body.
 *
 * This route gets all of the exchanges a user is a part of
 *
 */
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
        	exchanges.reverse();
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

/*
 * (POST) /home/create_exchange - Creates and exchange for the user.
 *
 * The request has a POST body.
 *
 * This route matches the user to another user for an exchange.
 * First it finds users that satisfy the users search, then
 * creates the exchange if succesful or notifies user of failure.
 */
router.post('/create_exchange', function(req, res) {
    var exchanges;
    Exchange.find({
        users: req.user._id
    }).exec(function(err, results) {
        console.log(err);
        if (err) {
            res.status(400).send({
                message: 'Error retrieving exchanges'
            });
        } else {
            exchanges = results;
            console.log('existing exchanges', exchanges);
            var other_user;
            User.find({
                    "$and": [{
                        proficiencies: req.body.language
                    }, {
                        desires: {
                            "$in": req.user.proficiencies
                        }
                    }]
                })
                .exec(function(err, users) {
                    console.log('users: ', err, users);
                    if (users.length == 0) {
                        console.log('do something');
                        res.status(400).send({
                            message: 'No users could be found who matched your specified languages. Try a different language to learn.'
                        });
                    } else {
                        users = shuffle(users);
                        for (var i = 0; i < users.length; ++i) {
                            console.log(users[i]);
                            if (exchanges.length == 0) {
                                other_user = users[i];
                            }
                            for (var exg = 0; exg < exchanges.length; ++exg) {
                                if (exchanges[exg].users.indexOf(users[i]._id) >= 0) {
                                	console.log("CURRENT EXCHANGE", i, exchanges[exg]);
                                    if (i == users.length - 1) {
                                        res.status(400).send({
                                            message: 'An exchange already exists with every user of your very special combination.'
                                        });
                                    } else {
                                        continue;
                                    }
                                } else {
                                    console.log(users[i]);
                                    other_user = users[i];
                                    break
                                }
                            }
                        }
                        if(other_user != undefined) {
	                        console.log(other_user);
	                        var matchingLanguages = req.user.proficiencies.filter(function(i) {
	                            return other_user.proficiencies.indexOf(i) > 0;
	                        });
	                        matchingLanguages = shuffle(matchingLanguages);
	                        var exchange = new Exchange({
	                            users: [other_user._id, req.user._id],
	                            request: req.body.language,
	                            proficiency: matchingLanguages[0]
	                        });
	                        exchange.save(function(err, exchange) {
	                            if (err) {
	                                console.log(err);
	                            } else {
	                                console.log(exchange);
	                                res.send({
	                                    exchange: exchange._id
	                                });
	                            }
	                        });
	                    }
                    }
                });
        }
    });
});

// Helper method that randomizes arrays
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

module.exports = router;
