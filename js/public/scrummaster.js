var socket = io.connect();

/**
 * Given an object where each property is a user name, refresh the list of online users
 */
function refreshUserList() {
	
	var userListStr = '';
	
	for (var i = 0; i < loggedInUsers.length; i++) {
		userListStr += '<div class="user"><p>' + loggedInUsers[i] + '</p></div>';
	}
    $("#loggedInUsers").html(userListStr);
}

/**
 * When a user logs in
 */
socket.on('login', function(data) {
	loggedInUsers[data] = 1;
	
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


/**
 * Page Load
 */
$(function() {
	refreshUserList();
});