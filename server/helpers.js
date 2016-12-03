var actions = {
	addUser: 'ADD_USER',
	updateUserName: 'UPDATE_USER_NAME',
	updateUserGroup: 'UPDATE_USER_GROUP',
	addGroup: 'ADD_GROUP',
	joinGroup: 'JOIN_GROUP',
	activateGroup: 'ACTIVATE_GROUP'
};

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
			return 'Could not create ' + subject + ' because it already exists.';
		}
	},
	opsErr: {
		name: 'opsErr',
		fn: () => {
			return 'Uh Oh, something went wrong. Please try again later.';
		}
	}
};

function respond(res, message) {
	res.type('text/xml');
	res.render('twiml', {
		message: message
	});
}

function generateError(err, type, subject) {
	return {
		rsp: err,
		msg: (errMsgs[type]['fn'])(subject)
	}
}

function processSMS(msg) {
	let result = {
		action: null,
		data: null
	};
	msg = msg.toLowerCase().trim();

	if (msg.indexOf('name') >= 0) {
		result.action = actions.updateUserName;
		result.data = {
			key: 'name',
			value: msg.split(' ')[1]
		};
	} else if (msg.indexOf('join group') >= 0) {
		result.action = actions.updateUserGroup;
		result.data = {
			key: 'group',
			value: msg.split(' ')[2]
		}
		result.key = 'group';
		result.value = msg.split(' ')[2];
	} else if (msg.indexOf('add group') >= 0) {
		result.action = actions.addGroup;
		result.data = {
			value: msg.split(' ')[2]
		}
	} else if (msg.indexOf('activate group') >= 0) {
		result.action = actions.activateGroup;
		result.data = {
			key: 'active',
			value: true
		}
	} else {
		result.action = actions.addUser;
	}

	return result;
}

module.exports = {
	respond: respond,
	processSMS: processSMS,
	actions: actions,
	errMsgs: errMsgs,
	generateError: generateError
};