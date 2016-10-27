/**
 * Created by Vityka on Feb, 28.
 */

var mongoose    = require('mongoose');
var Artist      = require('./artist');
var Album       = require('./album');
var Service       = require('./service');
var Schema      = mongoose.Schema;

if(!mongoose.models.Track) {
	var TrackSchema = new Schema({
		title: String,
		artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
		album: { type: Schema.Types.ObjectId, ref: 'Album' },
		services: [Service.schema],
		matched_at: { type: Date, default: Date.now() }
	});
	mongoose.model('Track', TrackSchema);
}

TrackSchema.pre('save', function(next) {
	var _this = this;
	saveArtist(_this.artist, function(err, artist){
		if(artist) _this.artist = artist;
		if(!_this.album) return next();
		saveAlbum(_this.album, function(err, album){
			if(album) _this.album = album;
			next();
		})
	});
});

var saveArtist = function(artist, done){
	var q = {'name': artist.name};
	if(artist.services.length > 0)
		q = {'services.id': artist.services[0].id};

	mongoose.model('Artist').findOne(q, function(err, data){
		if(err) done(err);
		else if(!data) artist.save(done);
		else done(err, data);
	});
}

//TODO: check albums with different names
var saveAlbum = function(album, done){
	var q = {'title': album.title};
	if(album.services.length > 0)
		q = {'services.id': album.services[0].id};

	mongoose.model('Album').findOne(q, function(err, data){
		if(err) done(err);
		else if(!data) album.save(done);
		else done(err, data);
	});
}

module.exports = mongoose.model('Track');
