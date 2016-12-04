var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var Santa = require('../../models/User');
var helpers = require('../helpers');
var operations = require('../operations');

function addGroupCtrl(req, res) {
	return operations.addGroup(req.body.group.name)
		.then(groupAcct => {
			return helpers.respond(res, groupAcct.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}


function inviteGroupCtrl(req, res) {
	return operations.inviteGroup(req.body.group.name, req.body.invites, req.body.group.inviteMsg)
		.then(groupMembers => {
			return helpers.respond(res, groupMembers.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}

function updateGroupCtrl(req, res) {
	return operations.updateGroup(req.body.group.name, req.body.update)
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

function activateGroupCtrl(req, res) {
	return operations.activateGroup(req.body.group.name)
		.then(activated => {
			return helpers.respond(res, activated.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});
}

module.exports = {
	addGroupCtrl: addGroupCtrl,
	inviteGroupCtrl: inviteGroupCtrl,
	updateGroupCtrl: updateGroupCtrl,
	activateGroupCtrl: activateGroupCtrl,
	joinGroupCtrl: joinGroupCtrl
};