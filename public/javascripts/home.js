/*
 * This file handles the client at the home page
 *
 * This includes listening for several buttons, and acting appropriately:
 * 		Exchange Buttons - Users can click on their exchanges to view them
 *		Create Exchange Button - Users can create a new exchange
 *		Settings Button - Users can click this to change their settings
 *		Message Buttons - Users can write and send messages through their exchanges
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
		renderExchange(result.exchange);
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
		var exchangeLink = '/exchanges/' + exchange_id;
		// Makes ajax request for the exchange
		$.ajax({
			url: exchangeLink
		})
		// Renders the messages on the user's page if exchange is successfully retrieved
		.done(function(result) {
			renderMessages(result.messages, result.user);
			$('#messages_container').data('exchangeId', result.exchange._id);
		})
		// Notifies the user if exchange retrieval fails
		.fail(function(err) {
			if(err.status == 401){
				window.location.href = err.responseJSON.redirect_url
			}
			console.log(err);
		});
	});
	$('#create-new').click(function() {
		$('#rightContainer').addClass('hidden');
		$('#newExchange').removeClass('hidden');
	});
});

// Helper method that renders user messages in an exchange
var renderMessages = function(messages, user) {
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
	var $messageInput = $("<input>", {type: 'text', id: 'message-input', class: 'form-control'});
	var $send = $("<button>", {id: 'sendButton', text: "Send"}).addClass("btn btn-md btn-success");
	$('#rightContainer').append($messageInput, $send);
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

// Function that will slide to the bottom of the messages container
var slideToBottom = function() {
	$("#messages_container").animate({
		scrollTop: $('#messages_container')[0].scrollHeight
	}, 1000);
}
