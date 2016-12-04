var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var User = require('../models/User');
var Group = require('../models/Group');
var helpers = require('./helpers');


function addUser(phone, name) {
	return new Promise((resolve, reject) => {
		if (!phone || !name) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var userId = helpers.createHash(phone);
			User.findOne({userId: userId})
				.then(user => {
					if (!user) {
						var newUser = new User({
							phone: phone,
							name: name,
							userId: userId
						});

						newUser.save()
							.then(rsp => {
								resolve({
									rsp: rsp,
									msg: 'Welcome to Santahood!'
								});
							})
							.catch(err => {
								reject(helpers.generateError(err, helpers.errMsgs.addErr.name, phone));
							})
					} else {
						resolve(helpers.generateError(null, helpers.errMsgs.dupErr.name, phone))
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	})
}

function updateUser(phone, hash) {
	return new Promise((resolve, reject) => {
		if (!phone || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			User.findOne({phone: phone})
				.then(user => {
					user[hash.key] = hash.value;
					user.save()
						.then(rsp => {
							resolve({
								rsp: rsp,
								msg: 'User updated!'
							});
						})
						.catch(err => {
							reject(helpers.generateError(err, helpers.errMsgs.updateErr.name, hash.key));
						})
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	});
}

function addGroup(name) {
	return new Promise((resolve, reject) => {
		if (!name) {
			reject(helpers.generateError(false, helpers.errMsgs.paramsErr.name, null));
		} else {
			Group.findOne({name: name})
				.then(group => {
					if (!group) {
						var newGroup = new Group({
							name: name,
							active: false
						});

						newGroup.save()
							.then(rsp => {
								resolve({
									rsp: rsp,
									msg: 'A new generation of elves is born! Group created.'
								});
							})
							.catch(err => {
								reject(helpers.generateError(err, helpers.errMsgs.addErr.name, name));
							})
					} else {
						resolve(helpers.generateError(null, helpers.errMsgs.dupErr.name, name))
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	})
}

function updateGroup(name, hash) {
	return new Promise((resolve, reject) => {
		if (!name || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			Group.findOne({name: name})
				.then(group => {
					group[hash.key] = hash.value;
					group.save()
						.then(rsp => {
							resolve({
								rsp: rsp,
								msg: 'Group updated!'
							});
						})
						.catch(err => {
							reject(helpers.generateError(err, helpers.errMsgs.updateErr.name, hash.key));
						})
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	});
}

module.exports = {
	updateUser: updateUser,
	addUser: addUser,
	addGroup: addGroup,
	updateGroup: updateGroup
};