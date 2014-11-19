var socket = io();

$(function(){
	socket.on('connect', function(){
		var user_id = $('#current_user_id').text();
		socket.emit('update user socket', user_id);
	});
})