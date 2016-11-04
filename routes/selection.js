var data = require("../data.json");

/* GET homepage */
exports.view = function(req, res) {
 	res.render('selection', data);
};

//change user status
exports.changeStatus = function(req, res) {
	data.user.status = req.params.id;
	console.log("changeStatus");
	console.log(data.user);
	res.json(data.user);
}

//return user
exports.getUser = function(req, res) {
	console.log("getUser");
	console.log(data.user);
	res.json(data.user);
}

//return group
exports.getGroup = function(req, res) {
	res.json(data.group);
}