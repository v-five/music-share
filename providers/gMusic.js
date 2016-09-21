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

Provider.prototype.search = function(options, done){
	options.limit = options.limit || 5;
	options.query = options.query || options.title + " " + options.artist;
	gMusicApi.initialize(function(err) {
		if(err) done(err);
		else
		gMusicApi.search(options.query, (options.limit < 5 ? 5 : options.limit), function (err, data) {
			if (!data || !data['entries']) done(err);
			else {
				var result = [];
				for (var i = 0; i < data['entries'].length; i++) {
					if (data['entries'][i].type === '1' &&
						options.query.toLowerCase().indexOf(data['entries'][i].track.title.toLowerCase()) > -1 &&
						options.query.toLowerCase().indexOf(data['entries'][i].track.artist.toLowerCase()) > -1
					){
						result.push(map(data['entries'][i].track));
						if(options.limit == 1) break;
					}
				}
				done(err, result);
			}
		});
	});
};

Provider.prototype.searchByUrl = function(url, done){
	var id = url.path.split('/').pop().split('?').shift();
	gMusicApi.initialize(function(err) {
		if(err) done(err);
		else
			gMusicApi.getAllAccessTrack(id, function (err, data) {
				if (!data) done(err);
				else if(data.error) done(data.error.message);
				else done(err, map(data));
			});
	});
};

var map = function(data){
	if(!data) return {};

	var artist = new models.Artist({
			name: data['artist'],
			services: [new models.Service({
				id: data['artistId'][0],
				name: 'gMusic',
				url: "https://play.google.com/music/listen#/artist/" + data['artistId'][0]
			})]
	});

	var album = new models.Album({
		title: data.album,
		services: [new models.Service({
			id: data['albumId'],
			name: 'gMusic',
			url: "https://play.google.com/music/listen#/album/" + data['albumId'],
			artwork: data['albumArtRef'][0].url
		})]
	});

	var track = new models.Track({
		title: data.title,
		artist: artist,
		album: album,
		services: [new models.Service({
			id: data.nid,
			name: 'gMusic',
			url: "https://play.google.com/music/r/m/" + data.nid + "?signup_if_needed=1",
			artwork: data['albumArtRef'][0].url
		})]
	});

	return track;
};

module.exports = new Provider();
