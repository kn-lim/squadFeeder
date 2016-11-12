var db = require('diskdb');
db.connect("./tmp/").loadCollections(["groups"]);
var datajson = require("../tmp/data.json");

// GET REQUEST FOR SELECTION PAGE
exports.view = function(req, res) {
	var groupid = req.params.groupid;
	var id = req.params.id;
	var data = db.groups.findOne({"name": groupid});

	//if group exists, load
	if (data) {
		//check if user in group
		var userInGroup = false;
		for (var i=0; i< data.members.length; i++) {
			if (data.members[i].id == id) {
				userInGroup = true;
				break;
			}
		}

		if (userInGroup) {
			console.log("Group loaded: " + groupid);
			//combine json and load
			for (var key in datajson) {
				data[key] = datajson[key];
			}
			res.render('selection', data);
		} else {
			res.render('error', {"errmsg":"You are not in this group."});
		}
	} else {
		res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
	}
}

// CHANGE USER STATUS
exports.changeStatus = function(req, res) {
	var groupid = req.params.groupid;
	var id = req.params.id;
	var status = req.params.status;
	var data = db.groups.findOne({"name": groupid});
	console.log("Changing status on id " + id + " to status " + status);

	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].id == id) {
			data.members[i].status = status;
		}
	}

	//write to group
	db.groups.update({"name": groupid}, data);
	res.json(data);
}

// CHECK IF ALL STATUS TRUE
exports.allSubmitted = function(req, res) {
	var groupid = req.params.groupid;
	var data = db.groups.findOne({"name": groupid});

	allSubmitted = true;
	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].connected && data.members[i].status == 0) {
			allSubmitted = false;
			break;
		}
	}

	console.log("allSubmitted: " + allSubmitted);
	res.send(allSubmitted);
};

// GETS POST REQUEST DATA AND WRITES IT TO FILE
exports.collectData = function(req, res) {
	var groupid = req.params.groupid;
	var id = req.params.id;
	var data = db.groups.findOne({"name": groupid});
	console.log("Request: ", req.body);

	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].id == id) {
			data.members[i].choices = req.body;
			db.groups.update({"name": groupid}, data);
			res.send("post successful");
			break;
		}
	}
}