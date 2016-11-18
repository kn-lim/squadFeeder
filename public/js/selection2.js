'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	console.log("Page initialized!");

	$('.dropdown-toggle').dropdown()

	//check status done or not (if so, open modal and wait)
	$.get("/getgroup/" + group, function(res) {
		//search for id
		for (var i in res.members) {
			if (res.members[i].id == id && res.members[i].status == 1) {
				$("#confirmModal").modal("show");
			}
		}
	});

	//on button submit change status to 1
	$(".btn-submit").click(function(e) {

		//change status to 1
		$.get("/changestatus/" + group + "/" + id + "/1", function(res) {
			window.setTimeout(function() {
				updateGroup(res);
				socket.emit("infochange");

				//on status change, check if all status complete
				$.get("/allSubmitted/" + group, function(res) {
					if (res) {
						console.log("all submitted!");
						socket.emit("allsubmitted");
					} else {
						console.log("not all submitted");
					}
				})
			}, 1000);
		});

		//submit data
		collectData();
	});

	//on modal close
	$("#confirmModal").on("hide.bs.modal", function(e) {
		$.get("/changestatus/" + group + "/" + id + "/0", function(res) {
			window.setTimeout(function() {
				updateGroup(res);
				socket.emit("infochange");	
			}, 1000);
		});
	});
});

//update lists with new groups
function updateGroup(resobj) {
	resobj = resobj || 0;

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
	$(".list-group").empty();
	for (var i in res.members) {
		//show all online members
		var listitem = "";

		//status tag
		if (res.members[i].connected) {
			if (res.members[i].status == 1) {
				var tag = '<span class="tag-done text-xs-right"> (Done!)</span>';
			} else {
				var tag = '<span class="tag-choosing text-xs-right"> (Choosing...)</span>';
			}
		}

		if (res.members[i].id == id) {
			//check if user
			listitem += "<b>" + res.members[i].name + " (You)" + "</b>" + tag + '</li>';
			listitem = '<li class="list-group-item">' + listitem;
			$(".list-group").append(listitem);
		} else if (res.members[i].connected) {
			//check other users connected
			listitem += res.members[i].name + tag + '</li>';			
			listitem = '<li class="list-group-item">' + listitem;
			$(".list-group").append(listitem);
		}
	}	
}

//collect all the data inputted
function collectData() {
	//collect checkbox data
	var cuisine = [];
	$("input[type=checkbox]").each(function() {
		if (this.checked) {
			cuisine.push($(this).val());
		}
	});

	var option1 = $("#select-option1").val();
	if (option1 != "nopref") {
		cuisine.push($("#select-option1").val());
	}

	var option2 = $("#select-option2").val();
	if (option2 != "nopref") {
		cuisine.push($("#select-option2").val());
	}

	var option3 = $("#select-option3").val();
	if (option3 != "nopref") {
		cuisine.push($("#select-option3").val());
	}

	console.log(cuisine);

	//create object to send
	var choices = {
		"cuisine": cuisine,
		"price": $("#select-price").val()
	}

	//send data
	$.post("/senddata/" + group + "/" + id, choices);
}

//change modal to submitted form
function submittedModal() {
	$(".modal-content").html('<div class="modal-submitted"><h3>All users have submitted! Calculating results...</h3></div>');
}
