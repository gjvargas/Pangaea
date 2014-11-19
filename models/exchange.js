var mongoose = require('mongoose');

var exchangeSchema = new mongoose.Schema({
  userOne : {
    type: String // The unique mongo id for the first user
  },

  userTwo : {
    type: String // The unique mongo id for the second user
  },

  messages : [{
  	type : mongoose.Schema.ObjectId,
    ref : 'Message',
  	index: { unique: true, dropDups: true }
  }]

})

module.exports = mongoose.model('Exchange', exchangeSchema);
