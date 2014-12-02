$(function(){

	$('.exchangeLink').click(function(event) {
		var exchangeLink = '/exchanges/' + event.target.id;
		$.ajax({
			url: exchangeLink
		})
		.done(function(result) {
			renderMessages(result.messages, result.user);
			$('#messages_container').data('exchangeId', result.exchange._id);
		})
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

var renderMessages = function(messages, user) {
	$('#rightContainer').removeClass('hidden');
	$('#newExchange').addClass('hidden');
	var $messages_container = $("<div>", {id: 'messages_container'});

	if(messages && messages.length > 0){
		messages.forEach(function(message) {
			$messages_container.append(makeMessageDiv(message, user));
		});
	}

	$('#rightContainer').empty().append($messages_container);

	var $messageInput = $("<input>", {type: 'text', id: 'message-input', class: 'form-control'});
	var $send = $("<button>", {id: 'sendButton', text: "Send"}).addClass("btn btn-md btn-success");
	$('#rightContainer').append($messageInput, $send);

	slideToBottom();
}

// Function which takes the message object as an argument and returns the message div
var makeMessageDiv = function(msg, current_user) {
	var author_name = msg.author.username;
	var text = msg.content;
	var time = moment(msg.time).format('hh:mma MM/DD');
	var chat_message = author_name + ' : ' + text;

	var $content = $('<span>', {class: 'message-content', text: chat_message});
	var $time = $('<span>').addClass('right').text(time);
	var $message = $('<div>').addClass('message')

	$message.append($content).append($time);

	if(author_name == current_user.username){
		$message.addClass('own-message');
	}

	return $message
}

var getTimeString = function(date) {
	var hour = date.getHours();
	hour = hour > 12 ? hour - 12 : hour;
	hour = hour == 0 ? hour + 12 : hour;
	var minute = date.getMinutes();
	minute = minute < 10 ? "0"+minute : minute;
	return hour + ":" + minute;
}

// Function that will slide to the bottom of the messages container
var slideToBottom = function() {
	$("#messages_container").animate({ 
		scrollTop: $('#messages_container')[0].scrollHeight
	}, 1000);
}