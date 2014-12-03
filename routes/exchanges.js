/*
 * This file defines the routes for exchanges.
 *
 * (GET) /exchanges/ - Takes the user to the home page.
 * (POST) /exchanges/create - Logs the user in.
 * (POST) /exchanges/create_exchange - Logs the user out
 * (GET) /:exchange_id
 * (GET) /:exchange_id/live
 * (GET) /fine/:user_id
 * (POST) /:exchange_id/messages
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');
var User = require('../models/user.js');

var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];


/*
 * (GET) /exchanges/ - Takes the user to the home page.
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
          var user_languages = languages.filter(function(i) { return req.user.proficiencies.indexOf(i) < 0;});
          var obj = {
            user: req.user,
            users: users,
            exchanges: exchanges,
            languages: user_languages
          };
          console.log(obj);
          res.render('crude', obj);
        });
    });
  }
});

/*
 * (GET) /exchanges/ - Takes the user to the home page.
 *
 * The request has a GET body.
 *
 * This route creates an exchange for two users.
 * Note that this one route i
 *
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

/*
 * Takes the user to the page of their exchange.
 *
 * The request has a GET body.
 *
 * We get the exchange in its state and render a page that handles the
 * interaction between the two users.
 */
router.get('/:exchange_id/live', function(req, res){
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
          Message
            .find({exchange: exchange._id})
            .populate('author')
            .exec(function(err, messages){
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
          });
        }
      })
  }
});

/*
    GET: Go to the page of the exchange that is combined both online and offline messages
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

/**
* Takes the user to their messages page.
*
* The request has a POST body that takes the message and the exchange_id.
*
* We send messages from one user to the other in the exchange.
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

/*
   DELETE: Delete an exchange
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
