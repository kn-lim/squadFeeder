var store = require('json-fs-store')('./tmp');

//GET HOMEPAGE
exports.view = function(req, res) {
	var groupid = req.params.groupid;

	//check master if exists
	store.load("/master", function(err, obj) {
		groupExists = false;
		for (var i = 0; i < obj.groups.length; i++) {
			//if name is in master, load
			if (obj.groups[i] == groupid) {	
				groupExists = true;	
				store.load("/groups/" + groupid, function(err, obj) {
					res.render('results', obj);
				});
				break;
			}
		}

		if (!groupExists) {
			res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
		}
	});
}
