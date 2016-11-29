var db = require('diskdb');
db.connect("./tmp/").loadCollections(["groups"]);
var animalList = require('../tmp/animals');

// GET REQUEST FOR GROUP PAGE
exports.view = function(req, res) {
	var groupid = req.params.groupid;
	var data = db.groups.findOne({"name": groupid});

	//if group exists, load
	if (data) {
		if (data.open) {
			res.render('group', data);
		} else {
			res.render('error', {"errmsg":"Your group is closed!"});
		}
	} else {
		res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
	}
}

// RETURNS GROUP DATA
exports.getGroup = function(req, res) {
	var groupid = req.params.groupid;
	var data = db.groups.findOne({"name": groupid});
	res.json(data);
}

// CHECKS USER ID. IF PART OF GROUP CONNECT, ELSE ADD TO GROUP
exports.checkID = function(id, groupid) {
	var data = db.groups.findOne({"name": groupid});

	//look for name in array
	exists = false;
	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].id == id) {
			exists = true;
			data.members[i].connected = true;
			break;
		}
	}

	//otherwise create new
	if (!exists) {
		console.log("user not found!");
		//check if leader (first one to join)
		var leader = (!data.members.length)?1:0;
		//generate random animal name
		var animal = "Anonymous " + animalList.animals[Math.floor(Math.random() * animalList.animals.length)];
		
		//generate new id
		data.members.push({
			"id": id,
			"name": animal,
			"leader": leader,
			"connected": true,
			"status": 0,
			"choices": 0
		});
	} else {
		console.log("user found!");
	}

	//write to group
	db.groups.update({"name": groupid}, data);
}

// WRITE CONNECTED TO 0 WHEN USER LEAVES
exports.userLeave = function(id, groupid) {
	var data = db.groups.findOne({"name": groupid});

	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].id == id) {
			data.members[i].connected = false;
		}
	}

	//write to group
	db.groups.update({"name": groupid}, data);
	console.log( db.groups.findOne({"name": groupid}));
}

// CHANGE USER NAME
exports.changeName = function(req, res) {
	console.log("Changing name on id " + id + " to name " + name);
	var groupid = req.params.groupid;
	var id = req.params.id;
	var name = req.params.name;
	var data = db.groups.findOne({"name": groupid});

	for (var i=0; i < data.members.length; i++) {
		if (data.members[i].id == id) {
			data.members[i].name = name;
		}
	}

	//write to group
	db.groups.update({"name": groupid}, data);
	res.json(data);
}

// CHANGE GROUP STATUS TO FALSE
exports.closeGroup = function(groupid) {
	console.log("Closing group " + groupid);
	var data = db.groups.findOne({"name": groupid});
	data.open = false;
	db.groups.update({"name": groupid}, data);
}