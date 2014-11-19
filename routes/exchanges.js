var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

/*
    GET: Crude homepage
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
          var obj = {
            user: req.user,
            users: users,
            exchanges: exchanges
          };
          res.render('crude', obj);

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
    GET: Live chat room
*/
router.get('/:exchange_id/live', function(req, res){
  if(!req.user){
    res.redirect('/');
  } else {
    // Find the exchange and check to make sure they are allowed to be in that room
    Exchange
      .findOne({_id: req.params.exchange_id})
      .exec(function(err, exchange){
        if(err){
          res.send(err);
        } else {
          if(exchange.users.indexOf(req.user._id) < 0){
            res.redirect('/')
          } else {

            // Setting up the sockets
            var room_id = req.params.exchange_id;
            var obj = {
              title: 'Socket Private Chat',
              room_id: room_id,
              user: req.user
            };
            res.render('exchanges/live',obj);
          }
        }
      });
  }
});

/*
    GET: Go to the page of the exchange
*/
router.get('/:exchange_id', function(req, res){
  if(!req.user){
    res.redirect('/');
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
    GET: Go to the page of the exchange you have with that user
*/
router.get('/find/:user_id', function(req, res){
  if(!req.user){
    res.redirect('/');
  } else {
    Exchange.findOne({'users' : { $all : [req.params.user_id, req.user._id] }}, function(err, exchange){
      if(err){
        res.send(err);
      } else {
        if(!exchange){
          res.redirect('/exchanges');
        } else {
          res.redirect('/exchanges/' + exchange._id);
        }
      }
    });
  }
});

/*
    POST: Send a message to the exchange
*/
router.post('/:exchange_id/messages', function(req, res){
  if(!req.user){
    res.redirect('/');
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
