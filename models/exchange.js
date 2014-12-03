/**
 * This file defines the mongoose model for an exchange.
 *
 * Each exchange consists of:
 *    2 user ids - these represent the users involved in the exchange
 *    request - a language that one of the users wants to learn
 *    proficiency - a language that one of the users is fluent in
 */

var mongoose = require('mongoose');

// The exchangeSchema is how we represent an exchange
var exchangeSchema = new mongoose.Schema({

  // Note that this array will always contain exactly 2 users
  users: [{
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  }],

  request: String,

  proficiency: String
});

module.exports = mongoose.model('Exchange', exchangeSchema);
