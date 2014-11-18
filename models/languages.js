var mongoose = require('mongoose');

var languageSchema = mongoose.Schema({
	language : {
		type : String,
		default : 'English'
	}
});

exports.Language = mongoose.model('Language', languageSchema);

exports.languageArray = [
	{
		language : 'English'
	},
	{
		language : 'Spanish'
	},
	{
		language : 'French'
	},
	{
		language : 'German'
	},
	{
		language : 'Portuguese'
	},
	{
		language : 'Italian'
	},
	{
		language : 'Chinese'
	},
	{
		language : 'Japanese'
	},
	{
		language : 'Korean'
	}
];
