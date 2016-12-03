var mongoose = require('mongoose');
var twilio = require('twilio');

var UserSchema = new mongoose.Schema({
	phone: String,
	name: String,
	recipient: String,
	santa: String,
	group: String,
	editable: Boolean
});

var User = mongoose.model('User', UserSchema);
module.exports = User;