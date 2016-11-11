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
					//parse data and return values
					res.render('results', calculateData(obj));
				});
				break;
			}
		}

		if (!groupExists) {
			res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
		}
	});
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