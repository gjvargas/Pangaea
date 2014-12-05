/**
 * Lead Authors: Faruk/Guillermo
 *
 * This file defines the routes for exchanges.
 *
 * (GET) /exchanges/create - Creates an exchange
 * (GET) /exchanges/:exchange_id - Gets an exchange
 * (GET) /exchanges/find/:user_id - Finds a user's exchanges
 * (POST) /exchanges/:exchange_id/messages - Posts a message to an exchange
 * (DELETE) /exchanges/:exchange_id/delete - Deletes an exchange
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

/*
 * (GET) /exchanges/create - Creates an exchange
 *
 * The request has a GET body.
 *
 * This route creates an exchange for two users.
 * Note that this route is only used for testing
 * and is not connected to the application
 */
router.post('/create', function(req, res) {
  console.log('trying to create exchange');
  var other_user_id = req.body.user_id;
  var exchange = new Exchange({
    users : [other_user_id, req.user._id]
  });
  console.log(exchange);
  exchange.save(function(err, exchange){
    if(err){
      console.log(err);
    } else {
      // res.send(exchange);
      res.redirect('index');
    }
  });
});

/*
 * (GET) /exchanges/:exchange_id - Gets an exchange
 *
 * The request has a GET body.
 *
 * This route finds an exchange given an exchange id.
 */
router.get('/:exchange_id', function(req, res){
  var is_ajax_request = req.xhr;

  if(!req.user){
    if(is_ajax_request){
      res.status(401).send({redirect_url: '/'});
    } else {
      res.redirect('/');
    }
  } else {
    Exchange
      .findOne({_id: req.params.exchange_id})
      .populate('users')
      .exec(function(err, exchange){
        if(err){
          res.status(400).send(err);
        } else {
          if(!exchange){
            res.status(400).send({message: "Exchange no longer exists"});
          } else {
            Message
            .find({exchange: exchange._id})
            .populate('author')
            .exec(function(err, messages){
              if(err){
                res.status(400).send(err);
              } else {
                var obj = {
                  user: req.user,
                  exchange: exchange,
                  messages: messages
                }
                res.send(obj);
              }
            });
          }
        }
      })
  }
});

/*
 * (GET) /exchanges/find/:user_id - Finds a user's exchanges
 *
 * The request has a GET body.
 *
 * This route finds a user's exchanges
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
 * (POST) /exchanges/:exchange_id/messages - Posts a message to an exchange
 *
 * The request has a POST body.
 *
 * This route creates a message and adds it to the appropriate exchange.
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

/*
 * (DELETE) /exchanges/:exchange_id/delete - Deletes an exchange
 *
 * The request has a DELETE body.
 *
 * This route deletes an exchange between two users.
 */
router.delete('/:exchange_id/delete', function(req, res){
  var is_ajax_request = req.xhr;

  if(!req.user){
    res.redirect('/');
  } else {
    Exchange
      .findOneAndRemove({_id: req.params.exchange_id}, function(err, exchange) {
        if(err){
          res.status(400).send(err);
        } else {
          if(is_ajax_request){
            res.send({})
          } else {
            res.redirect('/');
          }
        }
      });
  }
});

module.exports = router;
