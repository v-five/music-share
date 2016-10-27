/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var request = require('../utils').request;

var Provider = function () {
	this.shortName = 'deezer';
	this.name = 'Deezer';
	this.hostname = 'www.deezer.com';
	this.options = {
		hostname:   'api.deezer.com',
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
	this.options.path = '/track/'+id;
	request(this.options, function(err, track){
		if(err) done(err);
		else if(!track) done(false, undefined);
		else done(false, mapTrack(track));
	});
}

Provider.prototype.search = function(options, done){
	this.options.path = '/search?q='+ encodeURI(options.query) + '&limit=' + (options.limit < 5 ? 5 : options.limit);
	search(this.options, done);
};

Provider.prototype.match = function(track, done){
	this.options.path = '/search?q=artist:"' + encodeURI(track.artist.name) + '"%20track:"' + encodeURI(track.title) + '"';
	search(this.options, function(err, tracks){
		if(err) done(err);
		else done(false, match(tracks, track));
	});
};

var search = function(options, done){
	request(options, function(err, tracks){
		if(err) done(err);
		else done(false, (tracks ? tracks.data || [] : []).map(mapTrack).filter(function(track){ return track != undefined; }));
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
		title: track.title.replace(/ *\([^)]*\) */g, " ").trim(),
		artist: mapArtist(track.artist),
		album: mapAlbum(track.album),
		services: [new models.Service({
			id: track.id,
			name: 'deezer',
			url: track.link,
			artwork: track.album ? track.album['cover_big'] : ''
		})]
	});
};

var mapArtist = function(artist){
	if(!artist) return undefined;

	return new models.Artist({
			name: artist.name,
			services: [new models.Service({
				id: artist.id,
				name: 'deezer',
				url: artist.link,
				artwork: artist['picture_big']
			})]
	});
}

var mapAlbum = function(album){
	if(!album) return undefined;

	return new models.Album({
		title: album.title,
		services: [new models.Service({
			id: album.id,
			name: 'deezer',
			url: "http://www.deezer.com/album/" + album.id,
			artwork: album['cover_big']
		})]
	});
}

module.exports = new Provider();
