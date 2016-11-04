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
	updateGroup();

	$("h3").click(function() {
		 FB.ui({
		    method: 'share',
		    href: 'https://developers.facebook.com/docs/' //REPLACE THIS WITH A VALID URL FROM YOUR SITE OR USE PHP TO POPULATE IT
		  }, function(response) {
		    $("#response").html(response);
		  });
	})
}

//update lists with new groups
function updateGroup() {
	console.log("updateGroup called ");

	//write entire group in (for no args)
	console.log("first write");
	$(".list-group").empty();
	$.get("/selection/user", function(res) {
		$(".list-group").append('<li class="list-group-item list-user">' + res.name + '</li>');
	});

	//write members in
	$.get("/selection/group", function(res) {
		for (var i in res) {
			$(".list-group").append('<li class="list-group-item">' + res[i].name + '</li>');
		}
	});
}