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

socket.on('vote', function(data) {
    var user = data['login'],
    	vote = data['vote'],
    	voteComplete = true;
    
    votes[user] = vote;    
    
    refreshUserList();
    
    // if all votes are in, enable the reveal button
    for (var i = 0; i < loggedInUsers.length; i++) {
    	if (!votes[loggedInUsers[i]]) {
    		voteComplete = false;
    		break;
    	}
    }
    if (voteComplete) {
    	$('#reveal').show();	
    }
});

/**
 * Page Load
 */
$(function() {
	refreshUserList();
	
	$('#reset').click(function() {
		socket.emit('reset');
		clearUserVotes();
		$('#reset').html('Reset');
	});
	
	$('#reveal').click(function() {
		hideVotes = false;
		refreshUserList();
	});
});