var store = require('json-fs-store')('./tmp');

// GET PAGE
exports.view = function(req, res) {
	// get group data
	var groupid = req.params.groupid;

	// check master if group exists
	store.load("/master", function(err, obj) {
		exists = false;
		for (var i = 0; i < obj.groups.length; i++) {
			//if name is in master, load
			console.log(obj.groups[i]);
			if (obj.groups[i] == groupid) {	
				exists = true;	
				store.load("/groups/" + groupid, function(err, obj) {
					console.log("Group Loaded: " + groupid)
					res.render('group', obj);
				});
				break;
			}
		}

		if (!exists) {
			res.render('error');
		}
	});
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