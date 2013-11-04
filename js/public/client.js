var socket = io.connect(),
    votingOptions = [1,2, 3, 5, 8, 13, 20], 
    loggedIn = false,
    userName = '';

/**
 * When the user sets their login name.
 */
var setPseudo = function() {
	var pseudoName = $("#pseudoInput").val();
    if (pseudoName != "") {
    	if (loggedInUsers.indexOf(pseudoName) === -1) {
    		userName = pseudoName;
    		socket.emit('login', pseudoName);
            $('#pseudoInput').hide();
            $('#pseudoSet').hide(); 
            $('#errorMessage').hide();
            $('#statusMessage').html('<span class="glyphicon glyphicon-time"></span> &nbsp;Waiting for voting to open.').show();
            $('#loginControls').hide();
            $('#welcome').html('<h2>Welcome ' + pseudoName + '</h2>');
            loggedIn = true;
    	} else {
    		$('#errorMessage').html('<span class="glyphicon glyphicon-ban-circle"></span>&nbsp;That name is already taken, try again').show();
    	}
    }
};

/**
 * Render the voting options
 */
var renderVotingOptions = function() {
	
	$('#votingOptions').html('');
	for (var i = 0; i < votingOptions.length; i++) {
		$('#votingOptions').append('<div class=card id=vote' +  votingOptions[i] + ' onclick="vote(' + votingOptions[i] + ')">' + votingOptions[i] + '</div>');
	}
};

/**
 * Cast a vote
 * Display the 'Vote Cast' message
 * Hide the voting options
 */
var vote = function(value) {
	socket.emit('vote', value);
	$('#voteSent').html('<span class="glyphicon glyphicon-ok-circle"></span>&nbsp;Your vote has been cast').show();
	$('#votingOptions').hide();
};

/**
 * Enable voting options
 */
var enableVote = function(voteSubject) {
	if (loggedIn) {
		renderVotingOptions();
		$('#statusMessage').html('<span class="glyphicon glyphicon-tag"></span> &nbsp;Current vote: ' + voteSubject).show();
		$('#voteSent').hide();
		$('#votingOptions').show();	
	}
};

/**
 * When a user logs in, add their name to the list of loggedInUsers
 */
socket.on('login', function(data) {
	loggedInUsers.push(data);
});

/**
 * When a user logs out, remove their name from the list of loggedInUsers
 */
socket.on('logout', function(data) {
	
	// remove the user from the list
	var index = loggedInUsers.indexOf(data);
	if (index !== -1) {
		loggedInUsers.splice(index, 1);
	}
});

socket.on('beginVote', enableVote);

$(function() {
    $("#pseudoSet").click(function() {
        setPseudo();
        return false;
    });
    $('#newVoteButton').click(function() {
    	
    });
    $('#statusMessage').hide();
    $('#errorMessage').hide();
    $('#voteSent').hide();
    
    window.onbeforeunload = function() {
    	socket.emit('logoff', userName);
    };
});