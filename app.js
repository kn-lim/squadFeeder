// MODULE DEPENDENCIES
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var socketio = require('socket.io');
var bodyParser = require('body-parser');

// SET UP ROUTE VARIABLES (pages)
var index = require('./routes/index');
var group = require('./routes/group');
var selection = require('./routes/selection');
var results = require('./routes/results');

// all environments
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("secret"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// CONTROL ROUTES HERE
// EXAMPLE: app.get('/project.html', project.view)
// 			will route project.view (which is project.handlebars)
//			to <address>/project.html

// main route for page nav
app.get('/', index.view);
app.get('/:groupid', group.view);
app.get('/:groupid/selection/:id', selection.view);
app.get('/:groupid/results', results.view);

// routes for data logic
app.get('/creategroup/:groupid', index.createGroup);
app.get('/getgroup/:groupid', group.getGroup);
app.get('/changename/:groupid/:id/:name', group.changeName);
app.get('/changestatus/:groupid/:id/:status', selection.changeStatus);
app.get('/allsubmitted/:groupid', selection.allSubmitted);
app.post('/senddata/:groupid/:id', selection.collectData);

//start server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// SOCKET IO CODE
var io = socketio.listen(server);

// SOCKET LISTENERS
io.on('connection', function(socket) {
	console.log("SOCKETIO: " + socket.id + " connected");

	//socket group listener and check user id exists
	socket.on("group", function(idgroup) {
		console.log("new user has joined the group: " + idgroup[1]);
		socket.join(idgroup[1]);
		group.checkID(idgroup[0], idgroup[1]);
		io.in(idgroup[1]).emit('update');

		socket.on("disconnect", function(socket) {
			group.userLeave(idgroup[0], idgroup[1]);
			io.in(idgroup[1]).emit("update");
		});

		socket.on("infochange", function(socket) {
			io.in(idgroup[1]).emit("update");
		});

		socket.on("allready", function(socket) {
			group.closeGroup(idgroup[1]);
			io.in(idgroup[1]).emit("allready");
		});

		socket.on("allsubmitted", function(socket) {
			io.in(idgroup[1]).emit("allsubmitted");
		})
	});
});
