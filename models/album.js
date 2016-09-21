/**
 * Created by Vityka on Feb, 28.
 */

var mongoose    = require('mongoose');
var Service     = require('./service');
var Schema      = mongoose.Schema;

if(!mongoose.models.Album){
	var AlbumSchema = new Schema({
		title: String,
		services: [Service.schema],
		matched_at: { type: Date, default: Date.now() }
	});
	mongoose.model('Album', AlbumSchema)
}
module.exports = mongoose.model('Album');
