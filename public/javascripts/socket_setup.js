/*
 * Javascript file which has multiple stages
 *
 * 1. Connect the user to all the socket rooms for which they have an exchange in
 * 2. Handle socket reactions to when they receive messages from other sockets
 *
 * Author: Faruk
 */


var socket = io();

$(function(){
	var user_name = $('#current-user-name').text();
	var exchange_ids = get_exchange_ids();

	socket.on('connect', function(){
		socket.emit('update user socket', user_name);

		// We make sure they join all the exchange rooms
		exchange_ids.forEach(function(room_id){
			socket.emit('join room', room_id);
		});
	});

	// When the number of live users in a exchange change
	socket.on('users room update', function(obj){
		update_user_online_status(obj);
	});

	// When a user in an exchange sends a message
	socket.on('room message', function(obj){
		var current_exchange_id = $('#messages_container').data('exchangeId');

		// If the user is already on the exchange
		if(current_exchange_id == obj.room_id){
			$('#messages_container').append(makeMessageDiv(obj.message, {username: user_name}));
			slideToBottom();
		} else {
			// TODO: send a notification
		}
	});
})

// Function to see if a user is in a list or not
function is_user_in_list(username, users){
	var user_names = users.map(function(user){ 
		return user.username;
	});

	return user_names.indexOf(username) >= 0;
}

// Gets the list of exchange ids that the user is a part of
function get_exchange_ids(){
	result = [];

	$('.exchangeLink').each(function(){
		result.push(this.id);
	});

	return result;
}

// Function that updates the sidebar to tell whether or not a user is online
function update_user_online_status(obj){
	var $link = $('.exchangeLink#' + obj.exchange_id);
	var other_username = $link.first().find('.other-username').text()

	// Updating the status of whether or not the other user got online
	if(is_user_in_list(other_username, obj.users)){
		$link.find('#online-status').removeClass('hidden');
		$link.find('#offline-status').addClass('hidden');
	} else {
		$link.find('#online-status').addClass('hidden');
		$link.find('#offline-status').removeClass('hidden');
	}
}

function send_message(){
	var user_name = $('#current-user-name').text();
	var room_id = $('#messages_container').data('exchangeId');

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
}

// Handling what we do when a user receives a message

/*** Document Event Handlers ***/

// Sending a message
$(document).on('click', '#sendButton', send_message);

// Send a message if the user presses enter when they are over the text field
$(document).on('keypress', '#message-input', function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		send_message();
	}
	event.stopPropagation();
});