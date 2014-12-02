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
            languages: user_languages
          };
          console.log(obj);
          res.render('home/', obj);
        });
    });
  }
});

router.post('/create_exchange', function(req, res) {
  var other_user;

  User.find({proficiencies: req.body.language})
    .where({isOnline: true})
    .exec(function(err, user) {
      console.log('onlineUser: ', err, user);
      if(user.length == 0) {
        User.find({proficiencies: req.body.language})
          .exec(function(err, offline) {
            console.log('offlineUser: ', err, offline);
            if(offline.length == 0) {
              req.flash({error: 'No user available with language pair'});
              res.redirect('new_exchange');
            } else {
              other_user = offline[0]._id;
              var exchange = new Exchange({
                users : [other_user, req.user._id]
              });
              exchange.save(function(err, exchange){
                if(err){
                  console.log(err);
                } else {
                  res.redirect('/');
                }
              });
            }
        });
      } else {
        other_user = user[0]._id;
        var exchange = new Exchange({
          users : [other_user, req.user._id]
        });
        exchange.save(function(err, exchange){
          if(err){
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
      }
  });
});

module.exports = router;