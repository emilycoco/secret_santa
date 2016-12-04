var mongoose = require('mongoose');
var twilio = require('twilio');

var UserSchema = new mongoose.Schema({
	userId: String,
	phone: String,
	name: String,
	recipient: String,
	santa: String,
	group: String
});

var User = mongoose.model('User', UserSchema);
module.exports = User;