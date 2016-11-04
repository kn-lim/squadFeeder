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
	// add any functionality and listeners you want here

	$("h3").click(function() {
		 FB.ui({
		    method: 'share',
		    href: 'https://developers.facebook.com/docs/' //REPLACE THIS WITH A VALID URL FROM YOUR SITE OR USE PHP TO POPULATE IT
		  }, function(response) {
		    $("#response").html(response);
		  });
	})
}
