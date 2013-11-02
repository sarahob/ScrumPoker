var socket = io.connect();

var votingOptions = [1,2, 3, 5, 8, 13, 20];


var addMessage = function() {
    $("#voteSent").html('Your vote has been cast');
};

var sendMessage= function() {
    if ($('#messageInput').val() != "") {
        socket.emit('message', $('#messageInput').val());
        addMessage();
        $('#messageInput').val('');
        $('#submit').attr("disabled", true);
    }
};

var setPseudo = function() {
	var pseudoName = $("#pseudoInput").val();
    if (pseudoName != "") {
    	if (loggedInUsers.indexOf(pseudoName) === -1) {
    		socket.emit('login', $("#pseudoInput").val());
            $('#pseudoInput').hide();
            $('#pseudoSet').hide(); 
            $('#errorMessage').hide();
    	} else {
    		$('#errorMessage').html('That name is already taken, try again');
    	}
    }
};

var renderVotingOptions = function() {
	
	$('#votingOptions').html('');
	for (var i = 0; i < votingOptions.length; i++) {
		$('#votingOptions').append('<div id=vote' +  votingOptions[i] + ' onclick="vote(this)">' + votingOptions[i] + '</div>');
	}
};

var vote = function(voteEl) {
	var value = voteEl.innerHTML;
	socket.emit('message', value);
};

/**
 * When a user logs in
 */
socket.on('login', function(data) {
	loggedInUsers.push(data);
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
});

var enableVote = function() {
	renderVotingOptions();
	$('#submit').attr("disabled", false);
};

socket.on('reset', enableVote);
socket.on('begin', enableVote);

$(function() {
    $("#pseudoSet").click(function() {
        setPseudo();
    });
    $("#submit").click(function() {
        sendMessage();
    });
});