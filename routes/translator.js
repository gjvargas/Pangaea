var express = require('express');
var router = express.Router();
// Use bing translate
var bt = require('../public/javascripts/bing_translate.js').init({
  client_id: 'Pangaea',
  client_secret: 'PangaeaPangaeaPangaeaPangaea'
});

/*
 * Renders the inital page.
 * Mostly used for testing.
 */
router.get('/', function(req, res) {
  var obj = {
    title: 'Pangaea',
    translated: ''
  }
  res.render('translate', obj);
});

/*
 * Queries for the translation of text passed through URL.
 * Once translation is received from Bing, it is relayed to client.
 */
router.get('/translate', function(req, res) {
  var input = req.query.text;
  var language1 = req.query.language1;
  var language2 = req.query.language2;

  // query bing
  bt.translate(input, language1, language2, function(err, out){
    var translation = out.translated_text;
    //send translation to client
    res.send(translation);
  });
});

module.exports = router;
