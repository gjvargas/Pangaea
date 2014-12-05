/**
 * Lead Author: Faruk
 *
 * This file defines the mongoose schema for a message.
 *
 * Each message consists of a:
 *    medium - if we decide to implement different types of messages
 *    content - the data contained in the message
 *    time - a time stamp indicating when the message was sent
 *    author - the id of the user who wrote the message
 *    exchange - the exchange in which this message is being sent
 */

var mongoose = require('mongoose');

// The messageSchema is how we represent an exchange
var messageSchema = new mongoose.Schema({

  // The type of message being relayed
  medium : {
    type : String, // Should be either "text" or "audio"
    required : true
  },

  // A string containing message being relayed
  content : {
    type : String, // The message itself
    required : true
  },

  // A time stamp indicating when the message was sent
  time : {
    type : Date, // When the message was sent
    default : new Date(),
    require : true
  },

  // The user who sent the message
  author : {
    type : mongoose.Schema.ObjectId,
    ref : 'User',
    required : true
  },

  // The exchange in which the message was sent
  exchange : {
    type : mongoose.Schema.ObjectId,
    ref : 'Exchange',
    required : true
  }

});

module.exports = mongoose.model('Message', messageSchema);
