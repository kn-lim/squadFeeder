var store = require('json-fs-store')('./tmp');
var data = require("../tmp/data.json");

/* GET homepage */
exports.view = function(req, res) {
	// get group data
	var groupid = req.params.groupid;
	var id = req.params.id;

	// check master if group exists
	store.load("/master", function(err, obj) {
		groupExists = false;
		for (var i = 0; i < obj.groups.length; i++) {
			//if name is in master, load
			if (obj.groups[i] == groupid) {	
				groupExists = true;	
				store.load("/groups/" + groupid, function(err, obj) {
					//check if user in group. if so, load selection
					userInGroup = false;
					for (var i=0; i < obj.members.length; i++) {
						if (obj.members[i].id == id) {
							userInGroup = true;
							break;
						}
					}

					if (userInGroup) {
						console.log("Group Loaded: " + groupid);

						//combine json into one
						for (var key in data) {
							obj[key] = data[key];
						}

						res.render('selection', obj);
					} else {
						res.render('error', {"errmsg":"You are not in this group."});
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

//change user status
exports.changeStatus = function(req, res) {
	var group = req.params.groupid;
	var id = req.params.id;
	var status = req.params.status;
	console.log("change status on id " + id + " with status " + status);
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		//search for item, rewrite new name
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				obj.members[i].status = status;
			}
		}

		//store and return obj
		store.add(obj, function(err) {
			if (err) throw err;
			res.json(obj);
		})
	})
}

//checks if all statuses are true. if so, return true
exports.allSubmitted = function(req, res) {
	var group = req.params.groupid;
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		//search all items, send false if any status not done
		allSubmitted = true;
		for (var i = 0; i < obj.members.length; i++) {
			if (obj.members[i].connected == 1 && obj.members[i].status == 0) {
				allSubmitted = false;
				break;
			}
		}

		console.log("allSubmitted: " + allSubmitted);
		res.send(allSubmitted);
	});
};

//gets post request data and writes it to file
exports.collectData = function(req, res) {
	var group = req.params.groupid;
	var id = req.params.id;
	console.log(req.body);

	//get data and write to user
	store.load("/groups/" + group, function(err, obj) {
		if (err) throw err;

		for (var i=0; i < obj.members.length; i++) {
			if (obj.members[i].id == id) {
				//overwrite data
				obj.members[i].choices = req.body;
				store.add(obj, function(err) {
					if (err) throw err;
					res.send("post successful!");
				})
				break;
			}
		}
	});
}