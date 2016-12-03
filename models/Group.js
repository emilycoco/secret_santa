var mongoose = require('mongoose');
var twilio = require('twilio');

var GroupSchema = new mongoose.Schema({
	name: String,
	active: Boolean,
	startDate: Date,
	endDate: Date,
	members: Array
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;