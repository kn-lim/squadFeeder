var store = require('json-fs-store')('./tmp');
var db = require('diskdb');
db.connect('./tmp/').loadCollections(["groups"]);

// GET HOMEPAGE
exports.view = function(req, res) {
 	res.render('index');
};

exports.createGroup = function(req, res) {
	var groupid = req.params.groupid;
	console.log("creating group: " + groupid);

	//create new group
	db.groups.save(
	{
		"name": groupid,
		"open": true,
		"url": "https://squadfeeder.herokuapp.com/" + groupid,
		"members": []
	});
}