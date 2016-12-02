var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var Santa = require('../../models/Santa');
var helpers = require('../helpers');

function userCtrl(req, res) {
	return addUser(req.body.Phone)
		.then(santaAcct => {
			return helpers.respond(res, santaAcct.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});

}

function updateUserCtrl(req, res) {
	return updateUser(req.body.Phone, req.body.Update)
		.then(updatedSanta => {
			return helpers.respond(res, updatedSanta.msg);
		})
		.catch(err => {
			return helpers.respond(res, err.msg);
		});

}

function updateUser(phone, hash) {
	return new Promise((resolve, reject) => {
		if (!phone || !hash) {
			reject({
				rsp: false,
				msg: 'Not enough params supplied to updateUser'
			});
		} else {
			Santa.findOne({phone: phone})
				.then(santa => {
					santa[hash.key] = hash.value;
					santa.save()
						.then(rsp => {
							resolve({
								rsp: rsp,
								msg: 'Santa updated!'
							});
						})
						.catch(err => {
							reject({
								rsp: err,
								msg: 'Could not update account.'
							});
						})
				})
				.catch(err => {
					reject({
						rsp: err,
						msg: 'Could not search accounts.'
					});
				});
		}
	});
}


function addUser(phone) {
	return new Promise((resolve, reject) => {
		if (!phone) {
			reject({
				rsp: false,
				msg: 'Not enough params supplied to addUser'
			});
		} else {
			Santa.findOne({phone: phone})
				.then(santa => {
					if (!santa) {
						var newSanta = new Santa({
							phone: phone
						});

						newSanta.save()
							.then(rsp => {
								resolve({
									rsp: rsp,
									msg: 'Welcome to Santahood!'
								});
							})
							.catch(err => {
								reject({
									rsp: err,
									msg: 'Could not save account.'
								});
							})
					} else {
						resolve({
							rsp: null,
							msg: 'There is already an account for this number'
						})
					}
				})
				.catch(err => {
					reject({
						rsp: err,
						msg: 'Could not search accounts.'
					});
				});
		}
	})
}

module.exports = {
	userCtrl: userCtrl,
	addUser: addUser,
	updateUserCtrl: updateUserCtrl,
	updateUser: updateUser
};