var express = require('express'), 
	app = express(),
    jade = require('jade'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 3000;


server.listen(port);

/*
 * Configure Express
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {
    layout: false
});
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res) {
	console.log(JSON.stringify(allClients));
    res.render('home.jade',  { users: JSON.stringify(allClients)});
});

app.get('/scrummaster', function(req, res) {

    res.render('scrummaster.jade', { users: JSON.stringify(allClients)});
});



/*
 * Configure Socket.io
 */
var allClients = [];

io.sockets.on('connection', function(socket) {
    
    /*
     * Login Event
     */
    socket.on('login', function(data) {
    	
    	socket.set('login', data, function() {
        	
            // let scrum master know that user has logged in.
        	// TODO: Use a scrummaster socket instead of broadcast
            socket.broadcast.emit('login', data);
            
            // add this client to the list of users
            allClients.push(data);
        	
        });
       
    });

    /*
     * Message Event
     */
    socket.on('message', function(message) {
    	console.log('Message: ' + message);
        socket.get('login', function(error, name) {

            var data = {
                message: message,
                login: name
            };
            socket.broadcast.emit('message', data);
        })
    });
    
    /*
     * Reset Event
     */
    socket.on('reset', function() {
    	
    	socket.broadcast.emit('reset');
    	
    });
    
    /*
     * Begin Event
     */
    socket.on('begin', function() {
    	
    	socket.broadcast.emit('begin');
    	
    });
    socket.on('disconnect', function() {
    	
    	socket.get('login', function(error, name) {
    		if (error) { 
    			throw new Error('Error Logging out');
    		}
    		else {
        		socket.broadcast.emit('logout', name);	
        		
        		// remove the user from the list of clients
        		var index = allClients.indexOf(name);
        		if (index !== -1) {
        			allClients.splice(index, 1);
        		}
    		}
    	});
    })
});



console.log('Listening on port ' + port);