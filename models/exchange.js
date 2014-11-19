var mongoose = require('mongoose');

var exchangeSchema = new mongoose.Schema({
  users: [{
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  }]
});

/* === Static Methods === */


// Function which creates the exchange if it does not exist 

module.exports = mongoose.model('Exchange', exchangeSchema);
