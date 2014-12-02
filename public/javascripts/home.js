var languages = ["English", "Spanish", "French", "Portuguese", "German", "Mandarin", "Korean", "Japanese", "Arabic"];

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
		$('#errorModal').modal('show');
	});
});

$(function(){

	$('.exchangeLink').click(function(event) {
		var exchange_id = $(this).closest('.exchangeLink').attr('id');
		var exchangeLink = '/exchanges/' + exchange_id;
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

$('#settings').click(function() {
    $('.check').prop('checked', true);
	$('#settingsModal').modal('show');
});

$('#settingsSave').click(function() {
	var proficiencyList = [];
	var desireList = [];
	$('#proficiencies input:checked').each(function() {
    	proficiencyList.push($(this).attr('name'));
	});
	$('#desires input:checked').each(function() {
    	desireList.push($(this).attr('name'));
	});
	var update = {
		proficiencies: proficiencyList,
		desires: desireList
	};
	$.ajax({
		type: 'POST',
		url: '/users/edit',
		data: JSON.stringify(update),
		contentType:"application/json"
	})
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
	.fail(function(err) {
		$('#modalBody').text(err.responseJSON.message);
		$('#errorModal').modal('show');
	});
});

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

// Function that will slide to the bottom of the messages container
var slideToBottom = function() {
	$("#messages_container").animate({ 
		scrollTop: $('#messages_container')[0].scrollHeight
	}, 1000);
}

