var mongoose = require('mongoose');
var twilio = require('twilio');

var SantaSchema = new mongoose.Schema({
	phone: String,
	name: String,
	recipient: String,
	santa: String,
	group: String
});

var Santa = mongoose.model('Santa', SantaSchema);
module.exports = Santa;