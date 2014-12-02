var express = require('express');
var router = express.Router();
var bt = require('../public/javascripts/bing_translate.js').init({
    client_id: 'Pangaea',
    client_secret: 'PangaeaPangaeaPangaeaPangaea'
  });

router.get('/', function(req, res) {
    var obj = {
      title: 'Pangaea',
      language1: 'en',
      language2: 'ro',
      translated: ''
    }
    res.render('translate', obj);


});

router.get('/translate', function(req, res) {
  var input = req.query.text;
  var language1 = req.query.language1;
  var language2 = req.query.language2;

  bt.translate(input, language1, language2, function(err, out){
    var translation = out.translated_text;
    var obj = {
      title: 'words',
      translated: out.translated_text,
      language1: language1,
      language2: language2,
      text: input
    };

    res.send(obj.translated);
  });
});

module.exports = router;
