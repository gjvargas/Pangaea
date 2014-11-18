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

	socket.on('users update', function(current_users){
		$('#num-online').text(current_users.length);
		console.log(current_users);
	});
})