var socket = io.connect();

function addMessage(msg, pseudo) {
    $("#chatEntries").html('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sendMessage() {
    if ($('#messageInput').val() != "") {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
        $('#submit').attr("disabled", true);
    }
}

function setPseudo() {
	var pseudoName = $("#pseudoInput").val();
    if (pseudoName != "") {
    	if (loggedInUsers.indexOf(pseudoName) === -1) {
    		socket.emit('login', $("#pseudoInput").val());
            $('#chatControls').show();
            $('#pseudoInput').hide();
            $('#pseudoSet').hide(); 
            $('#errorMessage').hide();
    	} else {
    		$('#errorMessage').html('That name is already taken, try again');
    	}
    }
}

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

socket.on('reset', function() {
	$('#submit').attr("disabled", false);
});

$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {
        setPseudo();
    });
    $("#submit").click(function() {
        sendMessage();
    });
});