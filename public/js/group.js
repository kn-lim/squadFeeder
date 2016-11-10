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
		changeName();
	});

	// namechange on enter keypress
	$("#input-namechange").on("keypress", function(e) {
		if (e.which == 13) {
			changeName();
		}
	});

	// submit for moving
	$(".btn-submit").click(function(e) {
		socket.emit("allready");
	});
}


function changeName() {
	var name = $("#input-namechange").val();
	window.localStorage.setItem("username", name);
	$.get("/changename/" + group + "/" + id + "/" + name, function(res) {
		window.setTimeout(function() {
			updateGroup(res);
		}, 1000);
		socket.emit("namechange");
	});
}
//update lists with new groups
function updateGroup(resobj) {
	resobj = resobj || 0;

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
}

function updateGroupWrite(res) {
	for (var i in res.members) {
		//show all online members
		if (res.members[i].id == id) {
			$(".list-group").append('<li class="list-group-item">' + "<b>" + res.members[i].name + " (You) " + "</b>" + 
				"<a href='javascript:;' data-toggle='modal' data-target='#modal-namechange'>(Change Name)</a>" + 
				'</li>');
		} else if (res.members[i].connected) {
			$(".list-group").append('<li class="list-group-item">' + res.members[i].name + '</li>');
		}
	}	
}