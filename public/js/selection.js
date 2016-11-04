'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("Page initialized!");

	//pass no parameters for initialization
	updateGroup(0);

	//on button submit change status to 1
	$(".btn-submit").click(function(e) {
		$.get("/selection/status/1", function(res) {
			updateGroup(res);
		});
	});

	//on button success
	$("#btn-success").click(function(e) {
		$.get("/selection/status/0", function(res) {
			updateGroup(res);
		});
	});

	//on modal close
	$(".modal").on("hide.bs.modal", function(e) {
		$.get("/selection/status/0", function(res) {
			updateGroup(res);
		});
	});
}

function updateGroup(res) {
	console.log("updateGroup called " + (res));

	//write entire group in (for no args)
	if (res == 0) {
		console.log("first write");
		$(".list-group").empty();
		$.get("/selection/user", function(res) {
			//sort tag
			if (res.status == 1) {
				var tag = '<span class="tag tag-default tag-done float-xs-right">Done!</span>';
			} else {
				var tag = '<span class="tag tag-default tag-choosing float-xs-right">Choosing</span>';
			}
			//append
			$(".list-group").append('<li class="list-group-item list-user">' + res.name + tag + '</li>');
		});

		//write members in
		$.get("/selection/group", function(res) {
			for (var i in res) {
				//sort tag
				if (res[i].status) {
					var tag = '<span class="tag tag-default tag-done float-xs-right">Done!</span>';
				} else {
					var tag = '<span class="tag tag-default tag-choosing float-xs-right">Choosing</span>';
				}

				$(".list-group").append('<li class="list-group-item">' + res[i].name + tag + '</li>');
			}
		});
	} else {
		//overwrite user element
		console.log("overwriting user");
		console.log(res.status);
		if (res.status == 1) {
				var tag = '<span class="tag tag-default tag-done float-xs-right">Done!</span>';
			} else {
				var tag = '<span class="tag tag-default tag-choosing float-xs-right">Choosing</span>';
			}
		$(".list-user").html(res.name + tag);
	}
}