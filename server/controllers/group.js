var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var Santa = require('../../models/User');
var helpers = require('../helpers');
var operations = require('../operations');

function addGroupCtrl(req, res) {
	return operations.addGroup(req.body.group)
		.then(groupAcct => {
			return helpers.respond(res, groupAcct.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}

function updateGroupCtrl(req, res) {
	return operations.updateGroup(req.body.group, req.body.update)
		.then(updatedGroup => {
			return helpers.respond(res, updatedGroup.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}

function joinGroupCtrl(req, res) {
	return operations.joinGroup(req.body.user.phone, req.body.group.name)
		.then(joinedGroup => {
			return helpers.respond(res, joinedGroup.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}

function activateGroupCtrl() {

}

module.exports = {
	addGroupCtrl: addGroupCtrl,
	updateGroupCtrl: updateGroupCtrl,
	activateGroupCtrl: activateGroupCtrl,
	joinGroupCtrl: joinGroupCtrl
};