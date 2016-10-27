/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var request = require('../utils').request;

var Provider = function () {
	this.shortName = 'spotify';
	this.name = 'Spotify';
	this.hostname = 'open.spotify.com';
	this.options = {
		hostname:   'api.spotify.com',
		port:       443,
		method:     'GET',
		protocol:   'https:',
		json:       true
	};
};

Provider.prototype.searchByUrl = function(url, done){
	var id = url.path.split('/').pop().split('?').shift();
	this.searchById(id, done);
};

Provider.prototype.searchById = function(id, done){
	this.options.path = '/v1/tracks/' + id;

	request(this.options, function(err, track){
		if(err) done(err);
		else if(track.error) done(track.error.message);
		else done(false, mapTrack(track));
	});
}

Provider.prototype.search = function(options, done){
	this.options.path = '/v1/search?type=track&limit=' + (options.limit < 5 ? 5 : options.limit) + '&q=' + encodeURI(options.query);
	search(this.options, done);
};

Provider.prototype.match = function(track, done){
	this.options.path = '/v1/search?type=track&limit=5&q=' + encodeURI(track.artist.name) + '%20' + encodeURI(track.title);
	search(this.options, function(err, tracks){
		if(err) done(err);
		else done(false, match(tracks, track));
	});
};

var search = function(options, done){
	request(options, function(err, data){
		if(err) done(err);
		else if(!data || !data.tracks || !data.tracks.items || data.tracks.items.length == 0) done(false, []);
		else done(false, data.tracks.items.map(mapTrack).filter(function(track){ return track != undefined; }));
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

	return models.Track({
		title: track.name,
		artist: mapArtist(track.artists[0]),
		album: mapAlbum(track.album),
		services: [new models.Service({
			id: track.id,
			name: 'spotify',
			url: track.external_urls.spotify,
			artwork: track.album.images.shift().url
		})]
	});
};

var mapArtist = function(artist){
	if(!artist) return undefined;

	return new models.Artist({
		name: artist.name,
		services: [new models.Service({
			id: artist.id,
			name: 'spotify',
			url: artist.external_urls.spotify
		})]
	});
}

var mapAlbum = function(album){
	if(!album) return undefined;

	return new models.Album({
		title: album.name,
		services: [new models.Service({
			id: album.id,
			name: 'spotify',
			url: album.external_urls.spotify,
			artwork: album.images.shift().url
		})]
	});
}

module.exports = new Provider();
