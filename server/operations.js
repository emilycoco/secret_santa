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

function updateUser(phone, hash, allow) {
	return new Promise((resolve, reject) => {
		if (!phone || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var userId = helpers.createHash(phone);
			User.findOne({userId: userId})
				.then(user => {
					if (user) {
						if (hash.key === 'name' || allow) {
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
						} else {
							reject(helpers.generateError(null, helpers.errMsgs.notEditableErr.name, null));
						}
					} else if (hash.key === name) {
						addUser(phone, hash.value);
					} else {
						reject(helpers.generateError(null, helpers.errMsgs.notFoundErr.name, null));
					}
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
			var groupId = helpers.createHash(name);
			Group.findOne({groupId: groupId})
				.then(group => {
					if (!group) {
						var newGroup = new Group({
							name: name,
							active: false,
							groupId: groupId
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
						reject(helpers.generateError(null, helpers.errMsgs.dupErr.name, name))
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	})
}

function updateGroup(name, hash, allow) {
	return new Promise((resolve, reject) => {
		if (!name || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var groupId = helpers.createHash(name);
			Group.findOne({groupId: groupId})
				.then(group => {
					if (hash.key === 'endDate' || allow) {
						if (Array.isArray(group[hash.key])) {
							group[hash.key].push(hash.value);
						} else {
							group[hash.key] = hash.value;
						}
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
					} else {
						reject(helpers.generateError(null, helpers.errMsgs.notEditableErr.name, null));
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	});
}

function joinGroup(userPhone, groupName) {
	return new Promise((resolve, reject) => {
		if (!userPhone || !groupName) {
			reject(helpers.generateError(false, helpers.errMsgs.paramsErr.name, null));
		} else {
			var userId = helpers.createHash(userPhone);
			var groupId = helpers.createHash(groupName);
			User.findOne({userId: userId})
				.then(user => {
					updateUser(userPhone, {
						key: 'group',
						value: groupId
					}, true)
						.then(rsp => {
							updateGroup(groupName, {
								key: 'members',
								value: userId
							}, true)
								.then(rsp => {
									resolve({
										rsp: rsp,
										msg: 'Group ' + groupName + ' joined!'
									});
								})
								.catch(err => {
									reject(err);
								});
						})
						.catch(err => {
							reject(err);
						});
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.notFoundErr.name, userPhone))
				});
		}
	})
}

module.exports = {
	updateUser: updateUser,
	addUser: addUser,
	addGroup: addGroup,
	updateGroup: updateGroup,
	joinGroup: joinGroup
};