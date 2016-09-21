/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var request = require('../utils').request;

var Provider = function () {
	this.shortName = 'deezer';
	this.name = 'Deezer';
	this.hostname = 'www.deezer.com';
};

Provider.prototype.search = function(options, done){
	options.limit = options.limit || 5;
	options.query = options.query || options.title + " " + options.artist;
	var opt = {
		hostname:   'api.deezer.com',
		port:       443,
		path:       '/search?q='+ encodeURI(options.query),
		method:     'GET',
		protocol:   'https:',
		json:       true
	};

	request(opt, function(err, data){
		if(!data || !data.data || data.data.length == 0) done(err);
		else{
			var tracks = data.data;
			var result = [];
			for(var i in tracks){
				if (options.query.toLowerCase().indexOf(tracks[i].title.toLowerCase()) > -1 &&
						options.query.toLowerCase().indexOf(tracks[i]['artist'].name.toLowerCase()) > -1
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
	var options = {
		hostname:   'api.deezer.com',
		port:       443,
		path:       '/track/'+id,
		method:     'GET',
		protocol:   'https:',
		json:       true
	};

	request(options, function(err, data){
		if(!data) done(err);
		else done(err, map(data));
	});
};

var map = function(data){
	if(!data) return {};

	var artist = new models.Artist({
			name: data['artist']['name'],
			services: [new models.Service({
				id: data['artist']['id'],
				name: 'deezer',
				url: data['album']['link'],
				artwork: data.album ? data.album['cover_big'] : ''
			})]
	});

	var album = data.album ? new models.Album({
		title: data.album['title'],
		services: [new models.Service({
			id: data['album']['id'],
			name: 'deezer',
			url: "http://www.deezer.com/album/" + data['album']['id'],
			artwork: data.album['cover_big']
		})]
	}) : new models.Album();

	var track = new models.Track({
		title: data.title.replace(/ *\([^)]*\) */g, " ").trim(),
		artist: artist,
		album: album,
		services: [new models.Service({
			id: data.id,
			name: 'deezer',
			url: data.link,
			artwork: data.album ? data.album['cover_big'] : ''
		})]
	});

	return track;
};

module.exports = new Provider();
