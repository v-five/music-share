/**
 * Created by Vityka on Feb, 28.
 */

var mongoose    = require('mongoose');
var Track     = require('./track');
var Schema      = mongoose.Schema;

if(!mongoose.models.Playlist) {
	var PlaylistSchema = new Schema({
		title: String,
		tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
		matched_at: { type: Date, default: Date.now() }
	});
	mongoose.model('Playlist', PlaylistSchema);
}

module.exports = mongoose.model('Playlist');
