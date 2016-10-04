/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var request = require('../utils').request;

var Provider = function () {
	this.shortName = 'spotify';
	this.name = 'Spotify';
	this.hostname = 'open.spotify.com';
};


Provider.prototype.search = function(options, done){
	options.limit = options.limit || 5;
	options.query = options.query || options.title + " " + options.artist;
	var opt = {
		hostname:   'api.spotify.com',
		port:       443,
		path:       '/v1/search?type=track&limit=' + (options.limit < 5 ? 5 : options.limit) + '&q=' + encodeURI(options.query),
		method:     'GET',
		protocol:   'https:',
		json:       true
	};

	request(opt, function(err, data){
		if(!data || !data.tracks || !data.tracks.items || data.tracks.items.length == 0) done(err);
		else{
			var result = [];
			var tracks = data.tracks.items;
			for(var i in tracks){
				if(options.query.toLowerCase().indexOf(tracks[i].name.toLowerCase()) > -1 &&
					 options.query.toLowerCase().indexOf(tracks[i]['artists'][0].name.toLowerCase()) > -1
				 ){
					result.push(map(tracks[i]));
					if(options.limit == 1) break;
				}
			}
			done(err, result);
		}
	});
};

Provider.prototype.searchByUrl = function(url, done){
	var id = url.path.split('/').pop().split('?').shift();
	this.searchById(id, done);
};

Provider.prototype.searchById = function(id, done){
	var options = {
		hostname:   'api.spotify.com',
		port:       443,
		path:       '/v1/tracks/'+id,
		method:     'GET',
		protocol:   'https:',
		json:       true
	};

	request(options, function(err, data){
		if(!data) done(err);
		else if(data.error) done(data.error.message);
		else done(err, map(data));
	});
}

var map = function(data){
	if(!data) return {};

	var artist = new models.Artist({
		name: data['artists'][0].name,
		services: [new models.Service({
			id: data['artists'][0].id,
			name: 'spotify',
			url: data['artists'][0]['external_urls']['spotify']
		})]
	});

	var album = new models.Album({
		title: data.album['name'],
		services: [new models.Service({
			id: data.album.id,
			name: 'spotify',
			url: data.album['external_urls']['spotify'],
			artwork: data.album.images.shift().url
		})]
	});

	var track = models.Track({
		title: data.name,
		artist: artist,
		album: album,
		services: [new models.Service({
			id: data.id,
			name: 'spotify',
			url: data['external_urls']['spotify'],
			artwork: data.album.images.shift().url
		})]
	});

	return track;
};

module.exports = new Provider();
