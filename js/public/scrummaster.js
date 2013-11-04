var socket = io.connect();
var votes = {};
var hideVotes = true;
var allVotesIn = true;

/**
 * Given an object where each property is a user name, refresh the list of online users
 */
var refreshUserList = function() {
	
	var userListStr = '', user;
	
	for (var i = 0; i < loggedInUsers.length; i++) {
		user = loggedInUsers[i];
		userListStr += '<div class="card"><p class="vote">';
		if (votes[user]) {
			if (hideVotes) {
				userListStr += 'X';
			} else {
				userListStr += votes[user];
			}
		} else {
			userListStr += '?';
		}
		userListStr += '</p><p class="username">' + user + '</p></div>';
	}
	userListStr += '<div class="after-card"></div>';
    $("#loggedInUsers").html(userListStr);
};

/**
 * Clear the votes, set hideVotes to true and refresh the list of users
 */
var clearUserVotes = function() {
	votes = {};
	allVotesIn = false;
	hideVotes = true;
	refreshUserList();
};

/**
 * When a user logs in
 * Add the username to the list of users
 * Refresh the list of users
 */
socket.on('login', function(data) {
	loggedInUsers.push(data);
	
	refreshUserList();
});

/**
 * When a user logs out
 * Remove their name from the list of users
 * Refresh the list of users
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
 * When a vote is cast
 * Register the vote for the user
 * Refresh the list of users.
 * Check if the voting is complete.
 */
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
    	allVotesIn = true;
    	$('#reveal').show();	
    }
});

/**
 * Page Load
 * Setup click events etc.
 */
$(function() {
	refreshUserList();
	
	$('#beginVote').click(function() {
		var voteSubject = $('#backlogNumber').val();
		if (voteSubject) {
			socket.emit('beginVote', voteSubject);
			$('#newVoteModal').modal('hide')
			clearUserVotes();
			$('#backlogNumber').val('');
			$('#reveal').removeAttr('disabled');
		}
	});
	
	$('#reveal').click(function() {
		if (allVotesIn) {
			hideVotes = false;
			refreshUserList();	
		}
		allVotesIn = true;
	});
	$('#reveal').attr('disabled','disabled');
});