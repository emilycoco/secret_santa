require("babel-polyfill");
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');
var Santa = require('../models/Santa');
var santaCtrl = require('./controllers/santa');
var helpers = require('./helpers');

mongoose.connect('mongodb://localhost/santaDB');

app.use(express.static(__dirname + '/../client/build'));

app.post('/user', santaCtrl.userCtrl);

app.post('/user/update', santaCtrl.updateUserCtrl);

app.post('/sms', function(req, res) {
	let action = helpers.processSMS(req.body.Body);
	switch (action.action) {
		case helpers.actions.updateUserName: {
			santaCtrl.updateUser(req.body.From, action.data)
				.then(rsp => {
					helpers.respond(res, rsp.msg);
				})
		}
		case helpers.actions.addUser: {
			santaCtrl.addUser(req.body.From)
				.then(rsp => {
					helpers.respond(res, rsp.msg);
				})
		}
	}
});

app.listen(8005, function () {
	console.log('Secret Santa Api listening on port %d!', this.address().port);
});