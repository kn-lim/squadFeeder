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

	// name change form listener
	$("#btn-namechange").click(function(e) {
		var name = $("#input-namechange").val();
		window.localStorage.setItem("username", name);
		$.get("/changename/" + group + "/" + id + "/" + name, function(res) {
			window.setTimeout(function() {
				updateGroup(res);
			}, 1000);
			socket.emit("namechange");
		});
	});

	// submit for moving
	$(".btn-submit").click(function(e) {
		socket.emit("allready");
	});
}

//update lists with new groups
function updateGroup(resobj=0) {
	//write entire group in (for no args)
	$(".list-group").empty();

	//write members in if no args
	if (!resobj) {
		$.get("/getgroup/" + group, function(res) {
			updateGroupWrite(res);
		});
	} else {
		updateGroupWrite(resobj);
	}

	//repair parent (for mobile)
	$(".list-group").hide();
	$('.list-group').get(0).offsetHeight;
	$('.list-group').show();
}

function updateGroupWrite(res) {
	for (var i in res.members) {
		//show all online members
		if (res.members[i].id == id) {
			$(".list-group").append('<li class="list-group-item">' + "<b>" + res.members[i].name + " (You) " + "</b>" + 
				"<a href='javascript:;' data-toggle='modal' data-target='#modal-namechange'>(Change Name)</a>" + 
				// "<button type='button' class='btn btn-primary btn-color'>Change Name</button>" +
				'</li>');
		} else if (res.members[i].connected) {
			$(".list-group").append('<li class="list-group-item">' + res.members[i].name + '</li>');
		}
	}	
}