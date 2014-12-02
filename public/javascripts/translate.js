$(function(){


$('button').click(function(event){
  var data  = {
    text: $('#translate-input').val(),
    language1: $('#from-language').val(),
    language2: $('#to-language').val()
  };
  console.log($('#translate-input').val());
  $.get(
    '/translator/translate',
    data,
    function(res, err){
      translate(res);
    }
  );
});

})

var translate = function(translation) {
  $('#translated').html(translation);
};
