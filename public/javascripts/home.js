var $newExchange = $("<h1> I want to learn... </h1><form action='create_exchange' method='post'><select name='language' id='languageSelect' class='form-control'><% for(var i = 0; i < languages.length; ++i) { %><option value=<%=languages[i]%>> <%=languages[i]%> </option><% } %></select><button class='btn btn-lg btn-success btn-block' id='createButton' type='submit'> Create Exchange </button></form>");

$('.exchangeLink').click(function(event) {

	console.log('LINK CLICK');
	var exchangeLink = '/exchanges/' + event.target.id;
	$.ajax({
		url: exchangeLink
	})
	.done(function(result) {
		console.log(result);
		renderMessages(result.messages, result.user);
		$('#messages_container').data('exchangeId', result.exchange._id);
	})
	.fail(function(err) {
		console.log(err);
	});
});

$('#create-new').click(function() {
	$('#rightContainer').addClass('hidden');
	$('#newExchange').removeClass('hidden');
});

var renderMessages = function(messages, user) {
	$('#rightContainer').removeClass('hidden');
	$('#newExchange').addClass('hidden');
	var $messages_container = $("<div>", {id: 'messages_container'});

	messages.forEach(function(message) {
		$messages_container.append(makeMessageDiv(message, user));
	});

	$('#rightContainer').empty().append($messages_container);

	var $messageInput = $("<input>", {type: 'text', id: 'message-input', class: 'form-control'});
	var $send = $("<button>", {id: 'sendButton', text: "Send"}).addClass("btn btn-md btn-success");
	$('#rightContainer').append($messageInput, $send);
}

// Function which takes the message object as an argument and returns the message div
var makeMessageDiv = function(msg, current_user) {
	var author_name = msg.author.username;
	var text = msg.content;
	var time = new Date(msg.time);

	var chat_message = author_name + ' : ' + text;

	var div = $('<div>').addClass('message').text(chat_message).append(
		$('<span>').addClass('right').text(time)
	);

	if(author_name == current_user.username){
		div.addClass('own-message');
	}

	return div
}

var getTimeString = function(date) {
	var hour = date.getHours();
	hour = hour > 12 ? hour - 12 : hour;
	hour = hour == 0 ? hour + 12 : hour;
	var minute = date.getMinutes();
	minute = minute < 10 ? "0"+minute : minute;
	return hour + ":" + minute;
}