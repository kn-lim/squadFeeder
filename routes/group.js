var store = require('json-fs-store')('./tmp');

// GET PAGE
exports.view = function(req, res) {
	// get group data
	var groupid = req.params.groupid;

	//check if group file exists (if it does, load that group)
	var fs = require("fs");
	fs.access("./tmp/groups/" + groupid + ".json", fs.F_OK, function(err) {
		if (!err) {
			store.load("/groups/" + groupid, function(err, obj) {
				console.log("Group Loaded: " + groupid)
				res.render('group', obj);
			});
		} else {
			res.render("error");
		}
	})
};

// get group
exports.getGroup = function(req, res) {
	var groupid = req.params.groupid;
	store.load("/groups/" + groupid, function(err, obj) {
		if (err) console.log("NO SUCH FILE!");
		console.log("GET GROUP:");
		console.log(obj);
		res.json(obj);
	});
}

// check if id is in group
exports.checkID = function(id, group) {
	//load group obj
	store.load("/groups/" + group, function(err, obj) {
		if (err) console.log(err);

		//look for name in array
		exists = false;
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				exists = true;
				obj.members[i].connected = 1;
				break;
			}
		}

		//if id doesn't exist, add to group
		if (!exists) {
			obj.members.push({
				"id": id,
				"name": "User",
				"connected": 1,
				"status": 0,
				"choices": []
			});
		}

		//write new group
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
	var id = req.params.id;
	var name = req.params.name;
	var group = req.params.groupid;
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
		console.log(obj);
		store.add(obj, function(err) {
			if (err) throw err;
			res.json(obj);
		})
	})
}