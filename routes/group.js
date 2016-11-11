var store = require('json-fs-store')('./tmp');
var animalList = require('../tmp/animals');

// GET PAGE
exports.view = function(req, res) {
	// get group data
	var groupid = req.params.groupid;

	// check master if group exists
	store.load("/master", function(err, obj) {
		groupExists = false;
		for (var i = 0; i < obj.groups.length; i++) {
			//if name is in master, load
			if (obj.groups[i] == groupid) {	
				groupExists = true;	
				store.load("/groups/" + groupid, function(err, obj) {
					//check if group is open
					if (obj.open == 1) {
						console.log("Group Loaded: " + groupid)
						res.render('group', obj);
					} else {
						res.render('error', {"errmsg":"Your group is closed!"});
					}
				});
				break;
			}
		}

		if (!groupExists) {
			res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
		}
	});
};

// get group
exports.getGroup = function(req, res) {
	var groupid = req.params.groupid;
	store.load("/groups/" + groupid, function(err, obj) {
		if (err) throw err;
		res.json(obj);
	});
}

// check if id is in group and write new member
exports.checkID = function(id, group) {
	//load group obj
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		//determine if leader (first one to join)
		var leader = !obj.members.length ? 1 : 0;

		//look for name in array
		exists = false;
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				exists = true;
				obj.members[i].connected = 1;
				break;
			}
		}

		//choose random animal
		animal = "Anonymous " + animalList.animals[Math.floor(Math.random() * animalList.animals.length)];

		//if id doesn't exist, add to group
		if (!exists) {
			obj.members.push({
				"id": id,
				"name": animal,
				"leader": leader,
				"connected": 1,
				"status": 0,
				"choices": 0
			});
		}

		// write new group
		store.add(obj, function(err) {
			if (err) throw err;
		});
	});
}

// when id leaves, rewrite connected to 0
exports.userLeave = function(id, group) {
	//load group obj
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		//search for item
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				obj.members[i].connected = 0;
			}
		}

		//write new group
		store.add(obj, function(err) {
			if (err) throw err;
		});
	});
}

exports.changeName = function(req, res) {
	var group = req.params.groupid;
	var id = req.params.id;
	var name = req.params.name;
	console.log("change name on id " + id + " with name " + name);
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		//search for item, rewrite new name
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				obj.members[i].name = name;
			}
		}

		//store and return obj
		store.add(obj, function(err) {
			if (err) throw err;
			res.json(obj);
		})
	})
}

exports.closeGroup = function(group) {
	console.log("Closing group " + group);
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		obj.open = 0;

		//write new group
		store.add(obj, function(err) {
			if (err) throw err;
		});
	});
}