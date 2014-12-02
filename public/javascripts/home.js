$('.exchangeLink').click(function(event) {
	console.log('LINK CLICK');
	renderExchange(event.target.id);
});

$('#createButton').click(function() {
	console.log('CREATE CLICK');
	var languageRequest = $('#languageSelect option:selected').text();
	languageRequest = languageRequest.replace(/\s+/g, '');
	$.ajax({
		type: 'POST',
		url: 'create_exchange',
		data: {language: languageRequest},
		dataType:"json"
	})
	.done(function(result) {
		console.log(result);
		renderExchange(result.exchange);
	})
	.fail(function(err) {
		console.log(err.responseJSON.message);
		$('#modalBody').text(err.responseJSON.message);
		$('#createExchangeModal').modal('show');
	});
});

var renderExchange = function(exchangeID) {
	var exchangeLink = '/exchanges/' + exchangeID;
	$.ajax({
		url: exchangeLink
	})
	.done(function(result) {
		console.log(result);
		renderMessages(result.messages, result.user);
	})
	.fail(function(err) {
		console.log(err);
	});
}

$('#create-new').click(function() {
	$('#rightContainer').addClass('hidden');
	$('#newExchange').removeClass('hidden');
});

var renderMessages = function(messages, user) {
	$('#rightContainer').removeClass('hidden');
	$('#newExchange').addClass('hidden');
	var $messages_container = $("<div>", {id: 'messages_container'});

	messages.forEach(function(i) {
		console.log(i);
		var $message = $("<span>", {text: i.content});

		var userMessage = i.author.username == user.username;
		var messageClass = userMessage ? "userMessage" : "otherMessage";
		$message.addClass(messageClass);
		var timeString = getTimeString(new Date(i.time));
		$messages_container.append($message);
	});
	$('#rightContainer').empty().append($messages_container);

	var $messageInput = $("<textarea>", {id: 'messageInput'});
	var $send = $("<button>", {id: 'sendButton', text: "Send"}).addClass("btn btn-md btn-success");
	$('#rightContainer').append($messageInput, $send);
}



var getTimeString = function(date) {
	var hour = date.getHours();
	hour = hour > 12 ? hour - 12 : hour;
	hour = hour == 0 ? hour + 12 : hour;
	var minute = date.getMinutes();
	minute = minute < 10 ? "0"+minute : minute;
	return hour + ":" + minute;
}
