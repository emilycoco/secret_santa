require("babel-polyfill");
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 8005));
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
var userCtrl = require('./controllers/user');
var groupCtrl = require('./controllers/group');
var smsCtrl = require('./controllers/sms');
var helpers = require('./helpers');

mongoose.connect('mongodb://heroku_09tc25qd:7nm51k23e54iuv2fb8i6g8mmvr@ds119748.mlab.com:19748/heroku_09tc25qd');

app.use(express.static(__dirname + '/../client/build'));

app.post('/user/create', userCtrl.addUserCtrl);

app.post('/group/create', groupCtrl.addGroupCtrl);

app.post('/group/invite', groupCtrl.inviteGroupCtrl);

app.post('/group/update', groupCtrl.updateGroupCtrl);

app.post('/group/join', groupCtrl.joinGroupCtrl);

app.post('/group/activate', groupCtrl.activateGroupCtrl);

app.post('/sms', smsCtrl.smsCtrl);

app.listen(app.get('port'), function () {
	console.log('Secret User Api listening on port %d!', this.address().port);
});