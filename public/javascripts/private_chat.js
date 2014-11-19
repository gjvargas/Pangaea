var socket = io();

$(function(){
	var user_name = $('#current_user_name').text();
	var room_id = $('#room_id').text();

	$('form').submit(function(event){
		var msg = {
			type: "text",
			content: $('#message-input').val(),
			author: {username: user_name},
			time: new Date()
		};

		socket.emit('room message', { 
			room_id: room_id,
			message: msg});

		$('#message-input').val('');
		return false;
	});

	socket.on('room message', function(msg){
		var author_name = msg.author.username;
		var text = msg.content;
		var time = msg.time;

		var chat_message = author_name + ':' + text;
		$('#chat-messages').append($('<div>').addClass('chat-message').text(chat_message));
	});

	socket.on('connect', function(){
		socket.emit('update user socket', user_name);
		socket.emit('join room', room_id);
	});

	socket.on('users room update', function(users){
		$('#num-online').text(users.length);
		console.log(users);
		update_user_list(users);
	});
})

function update_user_list(users){
	$('#online-users').empty();
	users.forEach(function(user){
		var div = $('<div>').addClass('username').text(user.username);
		$('#online-users').append(div);
	});
}