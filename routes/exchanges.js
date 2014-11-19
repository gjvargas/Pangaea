/**
 * Lead Author: Faruk
 * This file defines the routes for the exchange page.
 *
 * (GET) / - Takes the user to the home page.
 * (POST) /login - Logs the user in.
 * (GET) /logout - Logs the user out
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

/**
* Testing function that creates exchanges
*
* The request has a GET body.
*
* We create an exchange between two user and render the test exchange page.
*
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

/**
* Takes the user to their user page.
*
* The request has a POST body that takes a the user_ids of the users joining the
* exchange. One user comes from the session, and one is passed in.
*
* We create the exchange in the database.
*
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

/**
* Takes the user to the page of their exchange.
*
* The request has a GET body.
*
* We get the exchange in its state and render a page that handles the
* interaction between the two users.
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

/**
* Takes the user to their messages page.
*
* The request has a POST body that takes the message and the exchange_id.
*
* We send messages from one user to the other in the exchange.
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
