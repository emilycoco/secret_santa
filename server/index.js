require("babel-polyfill");
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'jade');
var User = require('../models/User');
var userCtrl = require('./controllers/user');
var groupCtrl = require('./controllers/group');
var helpers = require('./helpers');
var operations = require('./operations');

mongoose.connect('mongodb://localhost/santaDB');

app.use(express.static(__dirname + '/../client/build'));

app.post('/user', userCtrl.addUserCtrl);

app.post('/user/update', userCtrl.updateUserCtrl);

app.post('/group', groupCtrl.addGroupCtrl);

app.post('/group/update', groupCtrl.updateGroupCtrl);

app.post('/group/join', groupCtrl.joinGroupCtrl);

app.post('/group/activate', groupCtrl.activateGroupCtrl);


app.post('/sms', function(req, res) {
	let action = helpers.processSMS(req.body.Body);

	switch (action.action) {
		case helpers.actions.updateUserName: {
			operations.updateUser(req.body.From, action.data)
				.then(rsp => {
					helpers.respond(res, rsp.msg);
				});
			break;
		}
		case helpers.actions.addUser: {
			operations.addUser(req.body.From)
				.then(rsp => {
					helpers.respond(res, rsp.msg);
				});
			break;
		}
	}
});

app.listen(8005, function () {
	console.log('Secret User Api listening on port %d!', this.address().port);
});