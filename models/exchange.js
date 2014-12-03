/**
 * This file defines the mongoose model for an exchange.
 *
 * Each exchange consists of two users. This is
 * represented as an array of users.
 */

var mongoose = require('mongoose');

// The exchangeSchema is how we represent an exchange
var exchangeSchema = new mongoose.Schema({
  // Note that this array will always contain exactly 2 users
  users: [{
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  }]
});

module.exports = mongoose.model('Exchange', exchangeSchema);
