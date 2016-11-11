'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
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

	window.setTimeout(function() {
		leaderCheck();
	}, 1000);	
})

//change name write
function changeName() {
	var name = $("#input-namechange").val();
	$.get("/changename/" + group + "/" + id + "/" + name, function(res) {
		window.setTimeout(function() {
			updateGroup(res);
			socket.emit("infochange");
		}, 1000);
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

//method for writing users
function updateGroupWrite(res) {
	for (var i in res.members) {
		//show all online members
		var listitem = "";

		//check if leader
		if (res.members[i].leader) {
			listitem += "&#9733 ";
		}

		if (res.members[i].id == id) {
			//check if user
			listitem += "<b>" + res.members[i].name + " (You) " + "</b>" + 
				"<a href='javascript:;' data-toggle='modal' data-target='#modal-namechange'>(Change Name)</a>" + 
				'</li>';

			listitem = '<li class="list-group-item">' + listitem;
			$(".list-group").append(listitem);
		} else if (res.members[i].connected) {
			//check other users connected
			listitem += res.members[i].name + '</li>';			
			listitem = '<li class="list-group-item">' + listitem;
			$(".list-group").append(listitem);
		}

	}	
}

//checks if user is leader - creates button if so
function leaderCheck() {
	$.get("/getgroup/" + group, function(res) {
		//scan
		var isLeader = false;
		for (var i in res.members) {
			if (res.members[i].id == id && res.members[i].leader) {
				isLeader = true;
			}
		}

		console.log("isleader" + isLeader);
		if (isLeader) {
			$(".div-button").html('<button type="button" class="btn btn-lg btn-primary btn-block btn-submit btn-color">Everyone Ready? Click Here</button>');

			// submit listener for moving group
			$(".btn-submit").click(function(e) {
				socket.emit("allready");
			});
		} else {
			$(".div-button").html('<div class="div-waiting">Waiting for &#9733 Squad Leader...</div>');
		}
	});
}