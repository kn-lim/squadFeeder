var db = require('diskdb');
db.connect("./tmp/").loadCollections(["groups"]);

//GET REQUEST FOR RESULTS PAGE
exports.view = function(req, res) {
	var groupid = req.params.groupid;
	var data = db.groups.findOne({"name": groupid});

	if (data) {
		res.render('results', calculateData(data));
	} else {
		res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
	}
}

function calculateData(data) {
	cuisinecount = {};
	for (var i=0; i < data.members.length; i++) {
		for (var j=0; j < data.members[i].choices.cuisine.length; j++) {
			if (data.members[i].choices.cuisine[j] in cuisinecount) {
				cuisinecount[data.members[i].choices.cuisine[j]]++;
			} else {
				cuisinecount[data.members[i].choices.cuisine[j]] = 1;
			}
		}
	}

	//pull top three out of list
	topthree = {"list":[]};
	for (var i=0; i < 3; i++) {

		highestval = {"name": "no category", "val": 0};
		for (key in cuisinecount) {
			if (cuisinecount[key] > highestval.val) {
				highestval.name = key;
				highestval.val = cuisinecount[key];
			}
		}

		topthree.list.push( highestval );
		// topthree.list.push( { highestval["name"]: highestval["val"]} );
		delete cuisinecount[highestval.name];
	}

	console.log(topthree);

	return topthree;
}