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
      console.log(JSON.stringify(res));
      translate(res);
      console.log('victory!');
    }
  );
});

})

var translate = function(translation) {
  $('#translated').html(translation);
};
