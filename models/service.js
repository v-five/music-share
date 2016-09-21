/**
 * Created by Vityka on Feb, 28.
 */


var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ServiceSchema = new Schema({
	 id:	 String,
	 name: String,
	 url: String,
	 artwork: String
});

module.exports = mongoose.model('Service', ServiceSchema);
