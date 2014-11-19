var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({

  medium : {
    type : String, // Should be either "text" or "audio"
    required : true
  },

  content : {
    type : String, // The message itself
    required : true
  },

  time : {
    type : Date, // When the message was sent
    default : new Date(),
    require : true
  },

  author : {
    type : mongoose.Schema.ObjectId,
    ref : 'User',
    required : true
  },

  exchange : {
    type : mongoose.Schema.ObjectId,
    ref : 'Exchange',
    required : true
  }

});

module.exports = mongoose.model('Message', messageSchema);
