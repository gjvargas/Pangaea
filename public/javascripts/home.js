/*
 * This file handles the client at the home page
 *
 * This includes listening for several buttons, and acting appropriately:
 * 		Exchange Buttons - Users can click on their exchanges to view them
 *		Create Exchange Button - Users can create a new exchange
 *		Settings Button - Users can click this to change their settings
 *		Message Buttons - Users can write and send messages through their exchanges
 *
 *
 * Authors: Faruh, Eben
 */

// The languages that we support as proficiencies and desires
var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

// This function listens, and acts when the create exchange button is clicked
$('#createButton').click(function() {
	console.log('CREATE CLICK');
	// Gets the language the user wants to learn
	var languageRequest = $('#languageSelect option:selected').text();
	languageRequest = languageRequest.replace(/\s+/g, '');
	// Makes post request for starting an exchange
	$.ajax({
		type: 'POST',
		url: 'create_exchange',
		data: {language: languageRequest},
		dataType:"json"
	})
	// Renders the exchange if successful
	.done(function(result) {
		console.log(result);

		console.log('joined room');
		socket.emit("join room", result.exchange._id);
		addExchange(result.exchange);
		renderExchange(result.exchange._id);
	})
	// Notifies the user if creation of the exchange fails
	.fail(function(err) {
		console.log(err.responseJSON.message);
		$('#modalBody').text(err.responseJSON.message);
		$('#errorModal').modal('show');
	});
});

// This function listens, and acts when an exchange is clicked
$(function(){
	$('.exchangeLink').click(function(event) {
		var exchange_id = $(this).closest('.exchangeLink').attr('id');
		renderExchange(exchange_id);
	});

	$('#create-new').click(function() {
		$('#rightContainer').addClass('hidden');
		$('#newExchange').removeClass('hidden');
	});

});

var renderExchange = function(exchange_id) {
	var exchangeLink = '/exchanges/' + exchange_id;
	$.ajax({
		url: exchangeLink
	})
	.done(function(result) {
		renderMessages(result.messages, result.user, result.exchange);
		$('#messages_container').data('exchangeId', result.exchange._id);
	})
	.fail(function(err) {
		if(err.status == 401){
			window.location.href = err.responseJSON.redirect_url
		}
		console.log(err);
	});
}

var addExchange = function(exchange) {
	var username = $('#current-user-name').text();
	var user0;
	var user1;

	$.ajax({
		url: '/users/find',
		data: {_id: exchange.users[0]},
		contentType:"application/json"
	})
	.done(function(result) {
		console.log(result);
		user0 = result.username
		$.ajax({
			url: '/users/find',
			data: {_id: exchange.users[1]},
			contentType:"application/json"
		})
		// Renders the messages on the user's page if exchange is successfully retrieved
		.done(function(result) {
			console.log(result);
			user1 = result.username
			
			var otherUser = user0 != username ? user0 : user1;
			console.log(username);
			console.log(otherUser);
			var $sideLink = $('<li>');
			var $link = $('<a>', {id: exchange._id, href: '#'});
			$link.addClass('exchangeLink');
			var $username = $('<span>');
			$username.addClass('other-username');
			$username.text(otherUser);
			var $green = $('<span>', {id: 'online-status'});
			$green.addClass('hidden green');
			$green.text(' [Online]');
			var $red = $('<span>', {id: 'offline-status'});
			$red.addClass('red');
			$red.text(' [Offline]');

			$link.append($username, $green, $red);
			$sideLink.append($link);

			$("#exchangesList").closest("li").after($sideLink);
		})
		// Notifies the user if exchange retrieval fails
		.fail(function(err) {
			console.log(err);
		});
	})
	.fail(function(err) {
		console.log(err);
	});
}

// Helper method that renders user messages in an exchange
var renderMessages = function(messages, user, exchange) {
	var other_username = $('#' + exchange._id).find('.other-username').text();

	$('#rightContainer').removeClass('hidden');
	$('#newExchange').addClass('hidden');
	var $messages_container = $("<div>", {id: 'messages_container'});
	// Add all of the messages to the container
	if(messages && messages.length > 0){
		messages.forEach(function(message) {
			$messages_container.append(makeMessageDiv(message, user));
		});
	}
	// Make everything look like it should
	$('#rightContainer').empty().append($messages_container);

	var $inputDiv = $("<div>", {id: 'input-container'});

	var $messageInput = $("<input>", {type: 'text', id: 'message-input', class: 'form-control'});
	var $send = $("<button>", {id: 'sendButton', text: "Send"}).addClass("btn btn-md btn-success");

	$inputDiv.append($messageInput, $send);

	// Making the delete button
	$delete_button = $("<button>", {
		class: 'btn btn-danger delete-exchange-button',
		text: 'Delete Exchange'
	});
	$delete_button.data('exchange_id', exchange._id);

	// Making the report user button
	$report_user_button = $("<button>", {
		class: 'btn btn-danger report-user-button',
		text: 'Report'
	});
	$report_user_button.data('username', other_username);

	$('#rightContainer').append($inputDiv, makeTranslatorDiv(exchange), $delete_button, $report_user_button);

	slideToBottom();
}

// Listens to settings button, and acts appropriately
$('#settings').click(function() {
    $('.check').prop('checked', true);
	$('#settingsModal').modal('show');
});

// Listens for saving the settings
$('#settingsSave').click(function() {
	var proficiencyList = [];
	var desireList = [];
	// Gets all of the proficiencies
	$('#proficiencies input:checked').each(function() {
    	proficiencyList.push($(this).attr('name'));
	});
	// And all of the desires
	$('#desires input:checked').each(function() {
    	desireList.push($(this).attr('name'));
	});
	// Packages the user's changes in an update object
	var update = {
		proficiencies: proficiencyList,
		desires: desireList
	};
	// Updates user profile via AJAX request
	$.ajax({
		type: 'POST',
		url: '/users/edit',
		data: JSON.stringify(update),
		contentType:"application/json"
	})
	// Updates the client when the request finishes
	.done(function(result) {
		console.log(result);
		$('#settingsModal').modal('hide');
		var notProficient = languages.filter(function(i) { return result.proficiencies.indexOf(i) < 0;});
		notProficient.forEach(function(i) {
			$('#proficiencies input:checkbox[name='+i+']').removeClass('check').prop('checked', false);
		});
		var notDesired = languages.filter(function(i) { return result.desires.indexOf(i) < 0;});
		notDesired.forEach(function(i) {
			$('#desires input:checkbox[name='+i+']').removeClass('check').prop('checked', false);
		});
	})
	// Notifies user if settings update fails
	.fail(function(err) {
		$('#modalBody').text(err.responseJSON.message);
		$('#errorModal').modal('show');
	});
});

// Function which takes the message object as an argument and returns the message div
var makeMessageDiv = function(msg, current_user) {
	// Get and format all of the message elements
	var author_name = msg.author.username;
	var text = msg.content;
	var time = moment(msg.time).format('hh:mma MM/DD');
	var chat_message = author_name + ' : ' + text;
	// Creates html for message
	var $content = $('<span>', {class: 'message-content', text: chat_message});
	var $time = $('<span>').addClass('right').text(time);
	var $message = $('<div>').addClass('message')
	$message.append($content).append($time);
	if(author_name == current_user.username){
		$message.addClass('own-message');
	}
	//return the message
	return $message
}

// Function that makes the translator div
var makeTranslatorDiv = function(exchange) {

	var $translateDiv = $('#hidden-translator').clone();

	$translateDiv.attr('id', 'translator-container')

	if(exchange.proficiency){
		var language_1 = language_conversion[exchange.proficiency.toLowerCase()];
		$translateDiv.find('#from-language').val(language_1);
	}

	if(exchange.request){
		var language_2 = language_conversion[exchange.request.toLowerCase()];
		$translateDiv.find('#to-language').val(language_2);
	}

	return $translateDiv;
}

// Function that will slide to the bottom of the messages container
var slideToBottom = function() {
	$("#messages_container").animate({
		scrollTop: $('#messages_container')[0].scrollHeight
	}, 1000);
}

// Function that will translate a request
$(document).on('click', '#translator-container button', function(event){

	var input = $('#translator-container #translate-input').val();
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
        $('#message-input').val(res);
      }
    );

});

// Delete exchange button
$(document).on('click', '.delete-exchange-button', function(event){

	var exchange_id = $(this).data('exchange_id');
	$.ajax({
	  type: "DELETE",
	  url: "/exchanges/" + exchange_id + "/delete"
	}).done(function(res){
		console.log(res);
		window.location.href = "/";
	}).fail(function(err){
		console.log(err);
	});
});

// report user button
$(document).on('click', '.report-user-button', function(event){
	var otheruser = $(this).data('username');
	console.log($(this).data('username'))
	$.ajax({
		url: '/users/report',
		type: "POST",
		data: {username: otheruser}
	}).done(function(res){
		console.log(otheruser + ' reported! now has ' + res.reports + ' reports');
		$( ".delete-exchange-button" ).trigger( "click" );
	}).fail(function(err){
		console.log(err);
	});
})

var language_conversion = {
	"arabic" : "ar",
	"bulgarian" : "bg",
	"catalan" : "ca",
	"mandarin" : "zh-CHS",
	"chinese traditional" : "zh-CHT",
	"czech" : "cs",
	"danish" : "da",
	"dutch" : "nl",
	"english" : "en",
	"estonian" : "et",
	"finnish" : "fi",
	"french" : "fr",
	"german" : "de",
	"greek" : "el",
	"haitian creole" : "ht",
	"hebrew" : "he",
	"hindi" : "hi",
	"hmong daw" : "mww",
	"hungarian" : "hu",
	"indonesian" : "id",
	"italian" : "it",
	"japanese" : "ja",
	"klingon" : "tlh",
	"klingon (piqad)" : "tlh-Qaak",
	"korean" : "ko",
	"latvian" : "lv",
	"lithuanian" : "lt",
	"malay" : "ms",
	"maltese" : "mt",
	"norwegian" : "no",
	"persian" : "fa",
	"polish" : "pl",
	"portuguese" : "pt",
	"romanian" : "ro",
	"russian" : "ru",
	"slovak" : "sk",
	"slovenian" : "sl",
	"spanish" : "es",
	"swedish" : "sv",
	"thai" : "th",
	"turkish" : "tr",
	"ukrainian" : "uk",
	"urdu" : "ur",
	"vietnamese" : "vi",
	"welsh" : "cy"
};
