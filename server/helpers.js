// Twilio Credentials
var accountSid = 'ACe5f6e550391f4e1d35603991ec989632';
var authToken = 'f2ead11bdf29563b61cb77275064fa6d';
var BBPromise = require("bluebird");
//require the Twilio module and create a REST client
var twilio = require('twilio')(accountSid, authToken);
BBPromise.promisifyAll(twilio);

// Error Messaging

var errMsgs = {
	paramsErr: {
		name: 'paramsErr',
		fn: () => {
			return 'Uh Oh, missing information for this action.';
		}
	},
	updateErr: {
		name: 'updateErr',
		fn: (subject) => {
			return 'Could not update ' + subject + '. Please try again later.';
		}
	},
	addErr: {
		name: 'addErr',
		fn: (subject) => {
			return 'Could not create record for ' + subject + '. Please try again later.';
		}
	},
	dupErr: {
		name: 'dupErr',
		fn: (subject) => {
			return 'Could not create record for ' + subject + ' because it already exists.';
		}
	},
	opsErr: {
		name: 'opsErr',
		fn: () => {
			return 'Uh Oh, something went wrong. Please try again later.';
		}
	},
	notFoundErr: {
		name: 'notFoundErr',
		fn: () => {
			return 'We couldn\'t find a record to update.';
		}
	},
	notEditableErr: {
		name: 'notEditableErr',
		fn: () => {
			return 'This property cannot be edited.';
		}
	}
};

function generateError(err, type, subject) {
	return {
		rsp: err,
		msg: (errMsgs[type]['fn'])(subject)
	}
}

// Send and Receive SMS

function respond(res, message) {
	res.type('text/xml');
	res.render('twiml', {
		message: message
	});
}

function sendSMS(toNumber, msg) {
	return new Promise((resolve, reject) => {
		twilio.messages.create({
			to: toNumber,
			from: "4152003052",
			body: msg,
		})
			.then(rsp => {
				resolve({
					rsp: rsp,
					msg: 'Sending to ' + toNumber + ' successful.'
				});
			})
			.catch(err => {
				reject({
					rsp: err,
					msg: 'Sending to ' + toNumber + ' failed.'
				});
			})
	});
}

var actions = {
	addUser: 'ADD_USER',
	joinGroup: 'JOIN_GROUP'
};

function processSMS(msg) {
	let result = {
		action: null,
		data: null
	};
	msg = msg.toLowerCase().trim();

	if (msg.indexOf('name') >= 0) {
		result.action = actions.addUser;
		result.data = {
			key: 'name',
			value: msg.split(' ').slice(1)
		};
	} else if (msg.indexOf('join') >= 0) {
		result.action = actions.joinGroup;
		result.data = {
			key: 'group',
			value: msg.split(' ').slice(1)
		};
	}

	return result;
}

// Hash Ids

function createHash(number) {
	var str = (number).toString();
	var hash;

	for (var i = 0; i < str.length; i++) {
		var chr = str[i].charCodeAt(0);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

// Shuffle Array

function shuffle (array) {
	let j = 0;
	let temp = null;

	for (let i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp
	}

	return array;
}

module.exports = {
	respond: respond,
	processSMS: processSMS,
	sendSMS: sendSMS,
	actions: actions,
	errMsgs: errMsgs,
	generateError: generateError,
	createHash: createHash,
	shuffle: shuffle
};