var mongoose = require('mongoose');

var exchangeSchema = new mongoose.Schema({
  users: [{
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  }]
});

module.exports = mongoose.model('Exchange', exchangeSchema);
