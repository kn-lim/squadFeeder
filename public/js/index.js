'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page initialized!");
	
	// for random backgrounds
	var images = 6;
	var randomval = Math.floor(Math.random() * images);
	var randombg = 	"linear-gradient(rgba(50,50,50,0.7),rgba(50,50,50,0.7)), url('../images/splash" + randomval + ".jpg";
	console.log("background: " + randombg);
	$('body').css('background-image', randombg);

	// on submit button click
	$(".btn-submit").click(function(e) {
		//generate new random URL
		var url = generateURL();
		console.log("generated URL: " + url);

		//get url and send to data (for new group generated)
		$.get("/creategroup/" + url, function(res) {
			console.log(res);
		});

		//wait for server to finish, open progress circle
		$("#modal-progress").modal({
			backdrop: "static",
			keyboard: false
		});		

		//route to random URL after delay
		window.setTimeout(function() {
			$("#modal-progress").modal("hide");
			window.location.href = "/" + url;
		}, 5000);
	});
})

function generateURL() {
	var url = "";
	var possible = "abcdefghijklmnopqrstuvwxyz1234567890";
	for (var i=0; i < 5; i++) {
		url += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return url;
}