var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Exchange = require('../models/exchange.js');
var Message = require('../models/message.js');

/*
    POST: Create exchange
*/
router.post('/create', function(req, res) {
  console.log('trying to create exchange');
  var exchange = new Exchange({
    userOne : req.body.userOne,
    userTwo : req.body.userTwo,
    messages : []
  });
  exchange.save(); // TODO: add callback if necessary
  //res.redirect('/', {title:'Pangaea'});
});

/*
    PUT: Add message to exchange
*/
router.put('/message', function(req, res) {
  var message = new Message({
    medium : req.body.medium,
    content : req.body.content,
    author : req.body.username
  });
  message.save(function(err, res) {
    console.log(res);
    Exchange.update({"userOne" : req.body.username},
    {
      "$push": {"messages": message}
    },
    function(err, res){
      console.log(err);
      console.log(res);
    });
  });
  // console.log(req.body.username);

});

/*
    PUT: Add array of messages to exchange
*/

/*
    GET: Get exchange
*/

module.exports = router;
