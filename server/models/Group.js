var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
	groupId: String,
	name: String,
	active: Boolean,
	startDate: Date,
	endDate: Date,
	members: Array
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;