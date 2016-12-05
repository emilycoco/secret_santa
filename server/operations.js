var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var User = require('../models/User');
var Group = require('../models/Group');
var helpers = require('./helpers');


function addUser(phone, name) {
	name = name.toLowerCase().trim();
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
									msg: 'Welcome to Santahood! You\'re registered, text "join groupName" to join a group, or text "help" to see a list of options.'
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

function updateUser(userId, hash) {
	return new Promise((resolve, reject) => {
		if (!userId || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			User.findOne({userId: userId})
				.then(user => {
					if (user) {
						if (!user[hash.key]) {
							user[hash.key] = hash.value;
							user.save()
								.then(rsp => {
									resolve({
										rsp: rsp,
										msg: 'User ' + hash.key + ' updated!'
									});
								})
								.catch(err => {
									reject(helpers.generateError(err, helpers.errMsgs.updateErr.name, hash.key));
								});
						} else {
							reject(helpers.generateError(null, helpers.errMsgs.dupErr.name, hash.key));
						}
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
	name = name.toLowerCase().trim();
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

function inviteGroup(name, invites, msg) {
	name = name.toLowerCase().trim();
	return new Promise((resolve, reject) => {
		if (!name || !invites || !msg) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var groupId = helpers.createHash(name);
			Group.findOne({groupId: groupId})
				.then(group => {
					if (group) {
						let invitePromises = [];
						invites.forEach(invite => {
							invitePromises.push(helpers.sendSMS(invite, msg));
						});
						Promise.all(invitePromises)
							.then(rsp => {
								resolve({
									rsp: rsp,
									msg: 'Invites sent successfully!'
								})
							})
							.catch(err => {
								reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
							})
					} else {
						reject({
							rsp: null,
							msg: 'This group doesn\'t exist, so we can\'t send invites yet.'
						});
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	});
}

function updateGroup(name, hash, allow) {
	name = name.toLowerCase().trim();
	return new Promise((resolve, reject) => {
		if (!name || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var groupId = helpers.createHash(name);
			Group.findOne({groupId: groupId})
				.then(group => {
					if (hash.key === 'endDate' || allow) {
						if (Array.isArray(group[hash.key]) && !group[hash.key].includes(hash.value)) {
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

function joinGroup(userPhone, group) {
	let groupName = group.toLowerCase().trim();
	return new Promise((resolve, reject) => {
		if (!userPhone || !groupName) {
			reject(null, helpers.generateError(false, helpers.errMsgs.paramsErr.name, null));
		} else {
			var userId = helpers.createHash(userPhone);
			var groupId = helpers.createHash(groupName);

			var updatedUserPromise = updateUser(userId, {
				key: 'group',
				value: groupId
			});
			var updatedGroupPromise = updateGroup(groupName, {
				key: 'members',
				value: userId
			}, true);

			Promise.all([updatedUserPromise, updatedGroupPromise])
				.then(rsp => {
					resolve({
						rsp: rsp,
						msg: rsp[0].rsp.name + ' added to group ' + rsp[1].rsp.name + '!'
					})
				})
				.catch(err => {
					reject({
						rsp: err,
						msg: 'Could not join group ' + group + ', only one group can be joined at a time.'
					});
				});
		}
	})
}

function activateGroup(name) {
	name = name.toLowerCase().trim();
	return new Promise((resolve, reject) => {
		if (!name) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var groupId = helpers.createHash(name);
			Group.findOne({groupId: groupId})
				.then(group => {
					if (group) {
						if (group.members) {
							var userPromises = [];
							let recipients = helpers.shuffle(group.members.slice());
							group.members.forEach(memberId => {
								let recipientId = recipients[recipients.length - 1] === memberId ? recipients.shift() : recipients.pop();
								userPromises.push(updateUser(memberId, {
										key: 'recipient',
										value: recipientId
									})
								);
								userPromises.push(updateUser(recipientId, {
										key: 'santa',
										value: memberId
									})
								);
							});
							Promise.all(userPromises)
								.then(rsp => {
									group.active = true;
									group.startDate = new Date();
									group.save()
										.then(rsp => {

											let userMsgPromises = [];
											group.members.forEach(memberId => {
												userMsgPromises.push(User.findOne({userId: memberId})
													.then(user => {
														User.findOne({userId: user.recipient})
															.then(recipientUser => {
																helpers.sendSMS(user.phone,
																'Your group is now active! Your recipient is ' +
																recipientUser.name +
																'. To communicate with your recipient or your santa text "send santa" or "send recipient" followed by a message.')
															});
													})
												);
											});

											Promise.all(userMsgPromises)
												.then(rsp => {
													resolve({
														rsp:rsp,
														msg: 'Group ' + group.name + ' activated!'
													})
												})
												.catch(err => {
													reject(err, helpers.generateError(err, helpers.errMsgs.updateErr.name, null));
												});
										})
										.catch(err => {
											reject(err, helpers.generateError(err, helpers.errMsgs.updateErr.name, null));
										});
								})
								.catch(err => {
									reject(err, helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
								})
						} else {
							reject(err, helpers.generateError(err, helpers.errMsgs.notFoundErr.name, null));
						}
					} else {
						reject(err, helpers.generateError(null, helpers.errMsgs.notFoundErr.name, null));
					}
				})
				.catch(err => {
					reject(err, helpers.generateError(err, helpers.errMsgs.notFoundErr.name, null));
				});
		}

		function random(arr) {
			return Math.floor(Math.random()*arr.length);
		}
	});
}

function sendMsg(phone, hash) {
	return new Promise((resolve, reject) => {
		if (!phone || !hash) {
			reject(helpers.generateError(err, helpers.errMsgs.paramsErr.name, null));
		} else {
			var userId = helpers.createHash(phone);
			User.findOne({userId: userId})
				.then(user => {
					if (user) {
						let send = {
							to: null,
							msg: null
						};

						if (hash.key === 'santa') {
							send.to = user.santa;
							send.msg = 'Message from your recipient: ' + hash.value;
						} else if (hash.key === 'recipient') {
							send.to = user.recipient;
							send.msg = 'Message from santa: ' + hash.value;
						}

						if (send.to) {
							User.findOne({userId: send.to})
								.then(user => {
									if (user) {
										helpers.sendSMS(user.phone, send.msg)
											.then(rsp => {
												resolve({
													rsp: rsp,
													msg: 'Message sent!'
												})
											})
									} else {
										reject({
											rsp: null,
											msg: 'Lost in communication, couldn\'t understand who to send this message to.'
										})
									}
								})
								.catch(err => {
									reject(null, helpers.generateError(err, helpers.errMsgs.notFoundErr.name, null));
								});
						} else {
							reject({
								rsp: null,
								msg: 'Couldn\'t find this recipient, is your group active yet?'
							})
						}
					} else {
						resolve(null, helpers.generateError(null, helpers.errMsgs.notFoundErr.name, phone))
					}
				})
				.catch(err => {
					reject(helpers.generateError(err, helpers.errMsgs.opsErr.name, null));
				});
		}
	})
}

module.exports = {
	addUser: addUser,
	addGroup: addGroup,
	inviteGroup: inviteGroup,
	updateGroup: updateGroup,
	joinGroup: joinGroup,
	activateGroup: activateGroup,
	sendMsg: sendMsg
};