var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var Santa = require('../../models/User');
var helpers = require('../helpers');
var operations = require('../operations');

function addUserCtrl(req, res) {
	return operations.addUser(req.body.From)
		.then(userAcct => {
			return helpers.respond(res, userAcct.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});

}

function updateUserCtrl(req, res) {
	return operations.updateUser(req.body.From, req.body.Update)
		.then(updatedUser => {
			return helpers.respond(res, updatedUser.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});

}

module.exports = {
	addUserCtrl: addUserCtrl,
	updateUserCtrl: updateUserCtrl
};