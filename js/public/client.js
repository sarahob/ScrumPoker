var socket = io.connect();

var votingOptions = [1,2, 3, 5, 8, 13, 20];

/**
 * When the user sets their login name.
 */
var setPseudo = function() {
	var pseudoName = $("#pseudoInput").val();
    if (pseudoName != "") {
    	if (loggedInUsers.indexOf(pseudoName) === -1) {
    		socket.emit('login', $("#pseudoInput").val());
            $('#pseudoInput').hide();
            $('#pseudoSet').hide(); 
            $('#errorMessage').hide();
            $('#statusMessage').show();
            $('#loginControls').hide();
    	} else {
    		$('#errorMessage').html('That name is already taken, try again');
    	}
    }
};

/**
 * Render the voting options
 */
var renderVotingOptions = function() {
	
	$('#votingOptions').html('');
	for (var i = 0; i < votingOptions.length; i++) {
		$('#votingOptions').append('<div id=vote' +  votingOptions[i] + ' onclick="vote(' + votingOptions[i] + ')">' + votingOptions[i] + '</div>');
	}
};

/**
 * Cast a vote
 * Display the 'Vote Cast' message
 * Hide the voting options
 */
var vote = function(value) {
	socket.emit('vote', value);
	$('#voteSent').html('Your vote has been cast').show();
	$('#votingOptions').hide();
};

/**
 * Enable voting options
 */
var enableVote = function() {
	renderVotingOptions();
	$('#statusMessage').hide();
	$('#voteSent').hide();
	$('#votingOptions').show();
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

socket.on('reset', enableVote);
socket.on('begin', enableVote);

$(function() {
    $("#pseudoSet").click(function() {
        setPseudo();
    });
    $('#statusMessage').hide();
});