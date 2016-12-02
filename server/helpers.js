var actions = {
	addUser: 'ADD_USER',
	updateUserName: 'ADD_USER_NAME',
	updateUserGroup: 'ADD_USER_GROUP',
	addGroup: 'ADD_GROUP',
	joinGroup: 'JOIN_GROUP',
	activateGroup: 'ACTIVATE_GROUP'
};

var methods = {
	updateUserName: function (santa, name) {
		santa.name = name;
		return santa;
	},
	updateUserGroup: function(santa, group) {
		santa.group = group;
		return santa;
	}
};

function respond(res, message) {
	res.type('text/xml');
	res.render('twiml', {
		message: message
	});
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
		}
		result.method = methods.updateUserName;
	} else if (msg.indexOf('join group') >= 0) {
		result.action = actions.updateUserGroup;
		result.data = {
			key: 'group',
			value: msg.split(' ')[2]
		}
		result.key = 'group';
		result.value = msg.split(' ')[2];
		result.method = methods.updateUserGroup;
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
	actions: actions
};