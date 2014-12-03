/**
 * Lead Author: Eben
 *
 * This file defines the mongoose schema for a user.
 *
 * Each user consists of:
 *    username - a unique string that identifies users
 *    email - the email that the user used to sign up
 *    password - the users password used for authentication
 *		isOnline - a boolean indicating whether the user is logged in or logged out
 *		proficiencies - an array of languages that the user has mastered
 *		desires - an array of languages that the user would like to learn
 *		notifications - an array of exchanges that have changed
 */

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({

	// Unique string representing the users identity
	username : {
		type : String,
		required : 'A citizen must have a username',
		index: {unique: true, dropDups: true}
	},

	// The email that the user registered with
	email : {
		type : String,
		required : 'A citizen must have an email address',
		index: {unique: true, dropDups: true}
	},

	// The password used to authenticate the user upon login
	password : {
		type : String,
		required : 'A citizen must have a password'
	},

	// Boolean indicating the login status of the user
	isOnline : {
		type : Boolean,
		default : false
	},

	// Array of languages the user is fluent in
	proficiencies : [{
		type : String
	}],

	// Array of languages the user wants to learn
	desires : [{
		type : String
	}],

	// Exchanges that have updated since the user last checked
	notifications : [{
		exchange : {
			type : mongoose.Schema.ObjectId,
    		ref : 'Exchange',
		}
	}]
});

// Check constraints on username to ensure username is reasonable
userSchema.path('username').validate(function(value, respond) {
  var long_enough = value.length > 1;
  var short_enough = value.length < 21;
  var valid_pattern = /\S+[\w\.\-]*/.test(value);
  respond(long_enough && short_enough && valid_pattern);
}, 'Name invalid.');

// Make sure email isn't complete gibberish
userSchema.path('email').validate(function(value, respond) {
  var short_enough = value.length < 35;
  var valid_pattern = /[\w\d\.\-]@\w+\.\w+/.test(value);
  if(!(short_enough && valid_pattern)){
  	respond(false);
  } else {
  	respond(true);
  }
}, 'Email invalid or already in use.');

// Make sure password is strong enough for use
userSchema.path('password').validate(function(value, respond) {
	var long_enough = value.length > 6;
	respond(long_enough);
}, 'Password not long enough');

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
