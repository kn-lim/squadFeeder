var store = require('json-fs-store')('./tmp');

// GET HOMEPAGE
exports.view = function(req, res) {
 	res.render('index');
};

exports.createGroup = function(req, res) {
	// get group id
	var groupid = req.params.groupid;
	console.log("createGroup: " + groupid);

	// create new group json
	var newGroup = {
		"id": "./groups/" + groupid,
		"name": groupid,
		"url": "squadfeeder.herokuapp.com/" + groupid,
		"members": [
		]
	}

	// create group json
	store.add(newGroup, function(err) {
		if (err) throw err;
	});
}