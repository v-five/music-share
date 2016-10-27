/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var gMusicApi = new require('../apis').gMusic;

var Provider = function () {
	this.shortName = 'gMusic';
	this.name = 'Google Play Music';
	this.hostname = 'play.google.com';
};

Provider.prototype.searchByUrl = function(url, done){
	var id = url.path.split('/').pop().split('?').shift();
	this.searchById(id, done);
};

Provider.prototype.searchById = function(id, done){
	gMusicApi.initialize(function(err) {
		if(err) return done(err);
		gMusicApi.getAllAccessTrack(id, function (err, track) {
			if (err) done(err);
			else if(!track) done(false, undefined);
			else if(track.error) done(track.error.message);
			else done(err, mapTrack(track));
		});
	});
}

Provider.prototype.search = function(options, done){
	options.limit = options.limit || 5;
	options.query = options.query;
	search(options, done);
};

Provider.prototype.match = function(track, done){
	var options = {};
	options.limit = 5;
	options.query = track.artist.name + " " + track.title;
	search(options, function(err, tracks){
		if(err) done(err);
		else done(false, match(tracks, track));
	});
}

var search = function(options, done){
	gMusicApi.initialize(function(err) {
		if(err) return done(err);
		var limit = options.limit || 5
		gMusicApi.search(options.query, limit + 5, function (err, data) {
			if (err) done(err);
			else if(!data || !data.entries) done(false, []);
			else done(false, data.entries.filter(function(entry){ return entry.type == 1; }).splice(limit).map(function(entry) {return entry.track;}).map(mapTrack).filter(function(track){ return track != undefined; }));
		});
	});
}

var match = function(tracks, track){
	//TODO: find a better way to match tracks
	var result = track.album.title ? tracks.filter(filterByAlbum, track.album.title) : [];
	if(result.length > 0) return result[0];
	return tracks[0];
}

var filterByAlbum = function(track){
	return track.album.title.toLowerCase().indexOf(this.toLowerCase()) > -1 ||
			this.toLowerCase().indexOf(track.album.title.toLowerCase()) > -1;
}

var mapTrack = function(track){
	if(!track) return undefined;

	return new models.Track({
		title: track.title,
		artist: mapArtist(track),
		album: mapAlbum(track),
		services: [new models.Service({
			id: track.nid,
			name: 'gMusic',
			url: "https://play.google.com/music/r/m/" + track.nid + "?signup_if_needed=1",
			artwork: track.albumArtRef ? track.albumArtRef[0].url : undefined
		})]
	});
};

var mapArtist = function(track){
	if(!track.artistId) return undefined;

	return new models.Artist({
			name: track.artist,
			services: [new models.Service({
				id: track.artistId[0],
				name: 'gMusic',
				url: "https://play.google.com/music/listen#/artist/" + track.artistId[0]
			})]
	});
}

var mapAlbum = function(track){
	if(!track.albumId) return undefined;

	return new models.Album({
		title: track.album,
		services: [new models.Service({
			id: track.albumId,
			name: 'gMusic',
			url: "https://play.google.com/music/listen#/album/" + track.albumId,
			artwork: track.albumArtRef[0].url
		})]
	});
}

module.exports = new Provider();
