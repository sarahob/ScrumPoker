var express = require('express'), 
	app = express(),
    jade = require('jade'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    socketEvents = require('./lib/socketEvents'),
    port = 3000;

server.listen(port);

/*
 * Configure Express
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {
    layout: true
});
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

/*
 * Routes
 */
var routes = {
	'/' : function(req, res) {
		res.render('vote.jade', { users: JSON.stringify(socketEvents.allClients)});
	},
	'/scrummaster' : function(req, res) {
	    res.render('scrummaster.jade', { users: JSON.stringify(socketEvents.allClients)});
	}
};
socketEvents.routeEvents.call(null, routes, app.get, app);

/*
 * Configure Socket.io
 */
io.sockets.on('connection', socketEvents.setupConnections);

console.log('Listening on port ' + port);