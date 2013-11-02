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

/**
 * Function for routing paths and events
 */
var routeEvents = function(routes, setupFn, scope) {
	
	for (var prop in routes) {
		if (routes.hasOwnProperty(prop)) {
			setupFn.call(scope, prop, routes[prop]);
		}
	}
};

/**
 * Routes
 */
var routes = {
	'/' : function(req, res) {
		res.render('home.jade', { users: JSON.stringify(allClients)});
	},
	'/scrummaster' : function(req, res) {
	    res.render('scrummaster.jade', { users: JSON.stringify(allClients)});
	}
};
routeEvents.call(null, routes, app.get, app);


/*
 * Configure Socket.io
 */
var allClients = [];



io.sockets.on('connection', function(socket) {
	var events = {
		/**
		 * Login
		 */
		'login': function(data) {
	    	
	    	socket.set('login', data, function() {
	        	
	            // let scrum master know that user has logged in.
	            socket.broadcast.emit('login', data);
	            
	            // add this client to the list of users
	            allClients.push(data);
	        	
	        });
	    },
	    
	    /**
	     * Vote
	     */
	    'vote': function(vote) {
	    	
	        socket.get('login', function(error, name) {

	            var data = {
	                vote: vote,
	                login: name
	            };
	            socket.broadcast.emit('vote', data);
	        })
	    },
	    
	    /**
	     * Reset
	     */
	    'reset': function() {
	    	
	    	socket.broadcast.emit('reset');
	    	
	    },
	    
	    /**
	     * Disconnect
	     */
	    'disconnect': function() {
	    	
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
	    }
	};
	
	routeEvents.call(null, events, socket.on, socket);
});

console.log('Listening on port ' + port);