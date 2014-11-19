var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

/*
    GET: Test page
*/
router.get('/test', function(req, res) {
  if(!req.user){
    res.redirect('/login');
  } else {
    User.find(function(err, users){

      // Find the exchanges which include that user
      Exchange
        .find({ 'users': req.user._id })
        .populate('users')
        .exec(function(err, exchanges){
          var obj = {
            user: req.user,
            users: users,
            exchanges: exchanges
          };
          res.render('exchanges/test', obj);

        });
    });
  }
});

/*
    POST: Create exchange
*/
router.post('/create', function(req, res) {
  console.log('trying to create exchange');
  var other_user_id = req.body.user_id;


  var exchange = new Exchange({
    users : [other_user_id, req.user._id]
  });
  exchange.save(function(err, exchange){
    if(err){
      res.send(err); 
    } else {
      res.send(exchange);
    }
  }); 
});

/*
    GET: Go to the page of the exchange
*/
router.get('/:exchange_id', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else {
    Exchange
      .findOne({_id: req.params.exchange_id})
      .populate('users')
      .exec(function(err, exchange){
        if(err){
          res.send(err);
        } else {
          Message.find({exchange: exchange._id}, function(err, messages){
            if(err){
              res.send(err);
            } else {
              var obj = {
                user: req.user,
                exchange: exchange,
                messages: messages
              }

              res.render('exchanges/show', obj);
            }
          })
        }
      })
  }
});

/*
    POST: Send a message to the exchange
*/
router.post('/:exchange_id/messages', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else {
    var new_message = new Message({
      author: req.user._id,
      medium: "text",
      time: new Date(),
      content: req.body.message,
      exchange: req.params.exchange_id
    });

    new_message.save(function(err, message){
      if(err){
        res.send(err);
      } else {
        res.redirect('/exchanges/' + req.params.exchange_id);
      }
    });
  }
});

module.exports = router;
