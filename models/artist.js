/**
 * Created by Vityka on Feb, 28.
 */

var mongoose    = require('mongoose');
var Service     = require('./service');
var Schema      = mongoose.Schema;

if(!mongoose.models.Artist) {
	var ArtistSchema = new Schema({
		name: String,
		services: [Service.schema],
		matched_at: { type: Date, default: Date.now() }
	});
	mongoose.model('Artist', ArtistSchema);
}
module.exports = mongoose.model('Artist');
