var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({

  medium : {
    type : String, // Should be either "text" or "audio"
    required : true
  },

  content : {
    type : String // The message itself
  },

  time : {
    type : Date, // When the message was sent
    default : new Date()
  },

  author : {
    type : mongoose.Schema.ObjectId,
    ref : 'User'
  }

});

module.exports = mongoose.model('Message', messageSchema);
