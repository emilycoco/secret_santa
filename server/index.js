require("babel-polyfill");
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'jade');

var userCtrl = require('./controllers/user');
var groupCtrl = require('./controllers/group');
var smsCtrl = require('./controllers/sms');
var helpers = require('./helpers');

mongoose.connect('mongodb://localhost/santaDB');

app.use(express.static(__dirname + '/../client/build'));

app.post('/user/create', userCtrl.addUserCtrl);

app.post('/group/create', groupCtrl.addGroupCtrl);

app.post('/group/invite', groupCtrl.inviteGroupCtrl);

app.post('/group/update', groupCtrl.updateGroupCtrl);

app.post('/group/join', groupCtrl.joinGroupCtrl);

app.post('/group/activate', groupCtrl.activateGroupCtrl);

app.post('/sms', smsCtrl.smsCtrl);

app.listen(8005, function () {
	console.log('Secret User Api listening on port %d!', this.address().port);
});