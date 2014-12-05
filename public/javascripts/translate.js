/*
 * Lead Author: Guillermo
 *
 * This method queries for the translation when the Translate button is clicked.
 * When the query completes, it updates the page appropriately.
 */

$(function(){
  // When the button is clicked, translate input
  $('button').click(function(event){
    var input = $('#translate-input').val();
    // handle the null case
    if(input === '') {
      input = ' ';
    }
    // construct data for query: the text to be translated, and the languages of translation
    var data  = {
      text: input,
      language1: $('#from-language').val(),
      language2: $('#to-language').val()
    };
    // perform the ajax query for translation
    $.get(
      '/translator/translate',
      data,
      function(res, err){
        //update the page
        translate(res);
      }
    );
  });
})

/*
 * This method is a simple helper method that
 * updates the html when the translation completes.
 */

var translate = function(translation) {
  $('#translated').html(translation);
};
