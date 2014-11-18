var mongoose = require('mongoose');
var languageSchema = require('./languages');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username : {
		type : String,
		required : 'A citizen must have a username',
		index: {unique: true, dropDups: true}
	},

	email : {
		type : String,
		required : 'A citizen must have an email address',
		index: {unique: true, dropDups: true}
	},

	password : {
		type : String,
		required : 'A citizen must have a password'
	},

	isOnline : {
		type : Boolean,
		default : false
	},

	socketID : {
		type : String,
		default : null
	}

	// proficiences : [{
	// 	type : languageSchema,
	// 	ref : 'Languages',
	// 	index: { unique: true, dropDups: true }
	// }]
});

userSchema.path('username').validate(function(value, respond) {
  var long_enough = value.length > 1;
  var short_enough = value.length < 21;
  var valid_pattern = /\S+[\w\.\-]*/.test(value);
  respond(long_enough && short_enough && valid_pattern);
}, 'Name invalid.');

userSchema.path('email').validate(function(value, respond) {
  var short_enough = value.length < 35;
  var valid_pattern = /[\w\d\.\-]@\w+\.\w+/.test(value);
  if(!(short_enough && valid_pattern)){
  	respond(false);
  } else {
  	respond(true);
  }
}, 'Email invalid or already in use.');

userSchema.path('password').validate(function(value, respond) {
	var long_enough = value.length > 6;
	respond(long_enough);
}, 'Password not long enough');

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);