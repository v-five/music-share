/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var youtubeApi = new require('googleapis').youtube('v3');

var Provider = function () {
	this.shortName = 'youtube';
	this.name = 'Youtube';
	this.hostname = 'www.youtube.com';
	this.options = {
		auth: 'AIzaSyAd_sQCYfImA_PL0eXFkVDo8fJb9Gcznv0',
		part :  'snippet',
		type :  'video',
		videoCategoryId :  '10',
		//videoLicense :  'creativeCommon,youtube'
	};
};

Provider.prototype.searchByUrl = function(url, done){
	var match = url.href.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
	var id = (match&&match[1].length==11)? match[1] : null;
	this.searchById(id, done);
};

Provider.prototype.searchById = function(id, done){
	this.options.id = id;
	youtubeApi.videos.list(this.options, function(err, data){
		if(err) done(err);
		else if(!data || !data.items) done(false, undefined);
		else done(false, mapTrack(data.items[0]));
	});
}

Provider.prototype.search = function(options, done){
	this.options.maxResults = options.limit < 5 ? 5 : options.limit;
	this.options.q = options.query;
	search(this.options, done);
};

Provider.prototype.match = function(track, done){
	this.options.maxResults = 5;
	this.options.q = encodeURI(track.artist.name) + "%20" + encodeURI(track.title);
	search(this.options, function(err, tracks){
		if(err) done(err);
		else done(false, match(tracks, track))
	});
};

var search = function(options, done){
	youtubeApi.search.list(options, function(err, data){
		if(err) done(err);
		else if(!data || !data.items) done(false, []);
		else done(false, data.items.map(mapTrack).filter(function(track){ return track != undefined; }));
	});
}

var match = function(tracks, track){
	//TODO: find a way to match tracks
	return tracks[0];
}

var mapTrack = function(track){
	if(!track) return undefined;

	var fullTitle = track.snippet.title.replace(/ *\([^)]*\) */g, " ").replace(/ *\[[^)]*\] */g, "").split('-');
	var artist = fullTitle.shift().trim();
	var title = fullTitle.length ? fullTitle.shift().trim() : undefined;
	if(!title) return undefined;

	return new models.Track({
		title: title,
		album: new models.Album({services: []}),
		artist: new models.Artist({name: artist}, {services: [new models.Service({name: "youtube"})]}),
		services: [new models.Service({
			id: track.id.videoId || track.id,
			name: 'youtube',
			url: 'https://www.youtube.com/watch?v=' + track.id.videoId,
			artwork: track.snippet.thumbnails.high.url
		})]
	});
};

module.exports = new Provider();
