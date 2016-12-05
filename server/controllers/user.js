var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var helpers = require('../helpers');
var operations = require('../operations');

function addUserCtrl(req, res) {
	return operations.addUser(req.body.user.phone, req.body.user.name)
		.then(userAcct => {
			return helpers.respond(res, userAcct);
		})
		.catch(err => {
			return helpers.respond(res, err);
		});
}

module.exports = {
	addUserCtrl: addUserCtrl
};