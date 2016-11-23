//create unique user id
if (!window.localStorage.getItem("userid")) {
	var id = generateNewID();
	window.localStorage.setItem("userid", id);
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
			// CHOOSE RANDOM PAGE
			if (Math.random() < 0.5) {
				window.location.replace("/selection?group=" + group + "&id=" + id);
			} else {
				window.location.replace("/selection2?group=" + group + "&id=" + id);
			}
			// window.location.replace("/" + group + "/selection/" + id);
		}, 1000);
	});

	//when everyone has submitted
	socket.on('allsubmitted', function() {
		submittedModal();
		window.setTimeout(function() {
			window.location.href = "/" + group + "/results";
		}, 3000);
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