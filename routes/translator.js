/*
 * This file defines the routes for translation.
 *
 * (GET) /translator/ - Takes user to translator page.
 * (GET) /translator/translate - Translates a query via Bing translate.
 *
 */

var express = require('express');
var router = express.Router();
// Use bing translate
var bt = require('../public/javascripts/bing_translate.js').init({
  client_id: 'Pangaea',
  client_secret: 'PangaeaPangaeaPangaeaPangaea'
});

/*
 * (GET) /translator/ - Takes the user to the Translator page.
 *
 * The request has a GET body.
 *
 * This takes the user to a page where they can translate between
 * any two languages that are supported by Bing translate. Note that
 * this page is used for testing, and isn't connected to the application.
 */
router.get('/', function(req, res) {
  var obj = {
    title: 'Pangaea',
    translated: ''
  }
  res.render('translate', obj);
});

/*
 * (GET) /translator/translate - Translates a query via Bing translate
 *
 * The request has a GET body.
 *
 * This route takes a string input and translates it from language
 * one to language two. This is done through the Bing API.
 */
router.get('/translate', function(req, res) {
  var input = req.query.text;
  var language1 = req.query.language1;
  var language2 = req.query.language2;

  if(!language1 || !language2 || !input){
    res.status(400).send({message: 'bad input'});
  } else {
    // query bing
    bt.translate(input, language1, language2, function(err, out){
      var translation = out.translated_text;
      //send translation to client
      res.send(translation);
    });
  }
});

module.exports = router;
