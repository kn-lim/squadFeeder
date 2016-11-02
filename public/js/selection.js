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

	//get tags text, add color
	$(".tag").each(function(index,obj) {
		console.log($(this).text());
		if ($(this).text() == "Choosing") {
			$(this).addClass("tag-choosing");
		} else if ($(this).text() == "Done!") {
			$(this).addClass("tag-done");
		}
	});
}