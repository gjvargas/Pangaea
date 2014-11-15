var socket = io();

$(function(){
	$('form').submit(function(event){
		socket.emit('chat message', $('#message-input').val());
		$('#message-input').val('');
		return false;
	});

	socket.on('chat message', function(msg){
		var text = 'User: ' + msg
		$('#chat-messages').append($('<div>').addClass('chat-message').text(text));
	});

	socket.on('user connected', function(num_online){
		console.log('user connected');
		$('#num-online').text(num_online);
	});

	socket.on('user disconnected', function(num_online){
		console.log('user disconnected');
		$('#num-online').text(num_online);
	});	
})