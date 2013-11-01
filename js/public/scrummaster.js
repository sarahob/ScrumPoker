var socket = io.connect();
var votes = {};
var hideVotes = true;


/**
 * Given an object where each property is a user name, refresh the list of online users
 */
var refreshUserList = function() {
	
	var userListStr = '', user;
	
	for (var i = 0; i < loggedInUsers.length; i++) {
		user = loggedInUsers[i];
		userListStr += '<div class="user"><p>' + user + (votes[user] ? ' (' + (hideVotes ? 'X' : votes[user]) + ') ' : '') + '</p></div>';
		
	}
    $("#loggedInUsers").html(userListStr);
};

var clearUserVotes = function() {
	votes = {};
	hideVotes = true;
	refreshUserList();
};

/**
 * When a user logs in
 */
socket.on('login', function(data) {
	loggedInUsers.push(data);
	
	refreshUserList();
});

/**
 * When a user logs out
 */
socket.on('logout', function(data) {
	
	// remove the user from the list
	var index = loggedInUsers.indexOf(data);
	if (index !== -1) {
		loggedInUsers.splice(index, 1);
	}
	
	refreshUserList();
});

socket.on('message', function(data) {
    var user = data['login'],
    	message = data['message'];
    
    votes[user] = message;    
    
    refreshUserList();
});

/**
 * Page Load
 */
$(function() {
	refreshUserList();
	
	$('#reset').click(function() {
		socket.emit('reset');
		clearUserVotes();
	});
	
	$('#begin').click(function() {
		socket.emit('begin');
		clearUserVotes();
		$('#begin').hide();
	});
	
	$('#reveal').click(function() {
		hideVotes = false;
		refreshUserList();
	});
});