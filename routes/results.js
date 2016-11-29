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
        console.log("Data" + data);
        
		var topthree = calculateData(data);
		res.render('results', topthree);
	} else {
		res.render('error', {"errmsg":"Your group is not found! Perhaps you entered the link incorrectly?"});
	}
}

function calculateData(data) {
	// FOR PRICES
	var chosenprice;
	for (var i=0; i < data.members.length; i++) {
		console.log(data.members[i].choices["price"]);
	}

	// FOR CUISINE
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

// function priceSelector(data) {
//     pricecount = {};
//     for(var i = 0; i < data.members.length; i++) {
//         if(data.members[i].)
//     }
// }

/* Modified by Kevin to include User Location */
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

    var pos = {
        lat: '32.8800604',
        lng: '-117.2362022'
    };

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         console.log("Yelp - Found User Location");
    //         pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };
    //     }, function() {
    //         handleLocationError(true, infoWindow, map.getCenter());
    //     });
    // } else {
    //     // Browser doesn't support Geolocation
    //     console.log("Yelp - Setting Position to UCSD");
    //     pos = {
    //         lat: '32.8800604',
    //         lng: '-117.2362022'
    //     };
    //     handleLocationError(false, infoWindow, map.getCenter());
    // }

    console.log("Latitude: " + pos.lat + " | Longitude: " + pos.lng);
	console.log("categories: " + categories);
	console.log("Sending yelp request!");

	//yelp request
	yelp.search({term: 'food', latitude: pos.lat, longitude: pos.lng, open_now: 'true', radius: '13000', sort_by: 'rating', categories: categories})
		.then(function(data) {
			console.log("yelp request success");
			res.json(data);
		})
		.catch(function(err) {
			console.log("yelp request error: ", err);
		});
};