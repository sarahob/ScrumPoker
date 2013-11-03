/**
 * Socket Events
 */
var socketEvents = function() {
	
	var allClients = [];
	
	/**
	 * Function for mapping object properties to functions. 
	 * This is used for routing paths to functions for the Express server,
	 * and also for the mapping socket events to functions.
	 * 
	 * @param routes - This is an string->function map.
	 * @param setupFn - This function will be called and passed the above 'string' and 'function' as params.
	 * @param scope -The scope for the setupFn call.
	 */
	var routeEvents = function(routes, setupFn, scope) {
		
		for (var prop in routes) {
			if (routes.hasOwnProperty(prop)) {
				setupFn.call(scope, prop, routes[prop]);
			}
		}
		
	};
	
	/**
	 * Map socket events to their respective handlers.
	 */
	var setupConnections = function(socket) {
		
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
		    
		    'logoff': function(userName) {
		    	
		    	socket.get('login', function(error, name) {
		    		
		    		if (name === userName) {
		    			
		    			socket.disconnect();
		    			
		    		}
		    		
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
		    'beginVote': function(voteSubject) {
		    	
		    	socket.broadcast.emit('beginVote', voteSubject);
		    	
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
	};
	
	return {
		routeEvents: routeEvents,
		setupConnections: setupConnections,
		allClients: allClients
	};
};

module.exports = socketEvents();