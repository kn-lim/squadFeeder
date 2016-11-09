//create unique user id
if (!window.localStorage.getItem("userid")) {
	var id = generateNewID();
	window.localStorage.setItem("userid", id);
	window.localStorage.setItem("username", "User");
} else {
	//user id found, get and check with group logs
	var id = window.localStorage.getItem("userid");
}

console.log("USER ID: " + id);

var socket;
initSocketIO();
function initSocketIO() {
	socket = io();

	// join group, send user id
	socket.on('connect', function(msg) {
		socket.emit("group", [id, group]);
	});

	// update users
	socket.on('update', function() {
		window.setTimeout(function() {
			updateGroup();
		}, 1000);		
	});

	socket.on('allready', function() {
		window.setTimeout(function() {
			window.location.href = "/" + group + "/selection";
		}, 1000);
	});
}

function generateNewID() {
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	for (var i=0; i < 10; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return id;
}