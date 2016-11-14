var Yelp = require('yelp-v3');
var yelp = new Yelp({
	access_token: '9SwSEoDWUYwCGDFVdI9L6T2PZ9lWa3qZu4PbE64tc3dZtlyKEzndIGjuU2O-JPxShQEB6M8ESc7RmYMCzB1M3T4uo_Ft8zFFAO3sQqObjxB-6q6Gsh07sHVAxa4bWHYx'
});
var db = require('diskdb');
db.connect("./tmp/").loadCollections(["groups"]);

//GET REQUEST FOR RESULTS PAGE
exports.view = function(req, res) {
	var groupid = req.params.groupid;
	var data = db.groups.findOne({"name": groupid});

	if (data) {
		var topthree = calculateData(data);
		res.render('results', topthree);
	} else {
		res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
	}
}

function calculateData(data) {
	cuisinecount = {};
	for (var i=0; i < data.members.length; i++) {
			if (data.members[i].choices != 0 && data.members[i].choices["cuisine"]) {
				for (var j=0; j < data.members[i].choices.cuisine.length; j++) {
					if (data.members[i].choices.cuisine[j] in cuisinecount) {
						cuisinecount[data.members[i].choices.cuisine[j]]++;
					} else {
						cuisinecount[data.members[i].choices.cuisine[j]] = 1;
					}
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

exports.yelpRequest = function(req, res) {
	//parse top categories
	var top = req.body.topthree;
	var categories = '';
	for (var i=0; i < top.length; i++) {
		if (top[i] != "no category") {
			if (i == 0) {
				categories += top[i];
			} else {
				categories += "," + top[i];
			}
		}
	}

	console.log("categories: " + categories);
	console.log("Sending yelp request!");

	//yelp request
	yelp.search({term: 'food', latitude: '32.8800604', longitude: '-117.2362022', limit: '5', open_now: 'true', sort_by: 'rating', category: categories})
		.then(function(data) {
			console.log("yelp request success");
			res.json(data);
		})
		.catch(function(err) {
			console.log("yelp request error: ", err);
		});
};