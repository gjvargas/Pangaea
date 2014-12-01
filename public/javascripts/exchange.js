var socket = io();

$(function(){
	var user_name = $('#current-user-name').text();
	var other_user_name = $('#other-user').text().trim();
	var room_id = $('#room-id').text();
	var users_in_room = [];

	$('form').submit(function(event){
		var msg = {
			type: "text",
			content: $('#message-input').val(),
			author: {username: user_name},
			time: new Date()
		};

		// Submitting a socket message
		socket.emit('room message', { 
			room_id: room_id,
			message: msg
		});

		// We also actually submit an ajax post request to update the database
		$.post("/exchanges/" + room_id + "/messages", {message: msg.content});

		$('#message-input').val('');
		return false;
	});

	socket.on('room message', function(msg){
		var author_name = msg.author.username;
		var text = msg.content;
		var time = new Date(msg.time);

		var chat_message = author_name + ' : ' + text;
		var chatStyle = author_name == user_name ? "userMessage" : "otherMessage";

		var div = $('<div>').addClass('message').text(chat_message).append(
			$('<span>').addClass('right').text(time)
		);

		if(author_name == user_name){
			div.addClass('own-message');
		}

		$('#messages').append(div);

		console.log(msg);
	});

	socket.on('connect', function(){
		socket.emit('update user socket', user_name);
		socket.emit('join room', room_id);
	});

	socket.on('users room update', function(users){
		users_in_room = users;
		console.log(users);
		// Updating the status of whether or not the other user got online
		if(is_user_in_list(other_user_name, users)){
			$('#online-status').removeClass('hidden');
			$('#offline-status').addClass('hidden');
		} else {
			$('#online-status').addClass('hidden');
			$('#offline-status').removeClass('hidden');
		}
	});
})

// Function to see if a user is in a list or not
function is_user_in_list(username, users){
	var user_names = users.map(function(user){ 
		return user.username 
	});

	return user_names.indexOf(username) >= 0
}