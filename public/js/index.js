'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("Page initialized!");
	
	//for random backgrounds
	var value = Math.floor((Math.random() * 6) + 1);
	var randombg = 	"linear-gradient(rgba(50,50,50,0.7),rgba(50,50,50,0.7)), url('../images/splash" + value + ".jpg";
	console.log(randombg);
	$('body').css('background-image', randombg)
}