$('.exchangeLink').click(function(event) {
	console.log('LINK CLICK');
	var exchangeLink = '/exchanges/' + event.target.id;
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
});

var renderMessages = function(messages, user) {
	var $messages_container = $("<div>", {id: 'messages_container'});

	messages.forEach(function(i) {
		console.log(i);
		var $message = $("<span>", {text: i.content});

		var userMessage = message.author.username == user.username;
		var messageClass = userMessage ? "userMessage" : "otherMessage";
		$message.addClass(messageClass);
		var timeString = getTimeString(Date.parse(i.time));
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
	return hour.toString() + ":" + minute.toString();
}