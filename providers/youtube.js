/**
 * Created by Vityka on Jan, 24.
 */

var models = require('../models');
var youtubeApi = new require('googleapis').youtube('v3');

var Provider = function () {
	this.shortName = 'youtube';
	this.name = 'Youtube';
	this.hostname = 'www.youtube.com';
};

Provider.prototype.search = function(options, done){
options.limit = options.limit || 5;
options.query = options.query || options.title + " " + options.artist;
	var opt = {
		auth: 'AIzaSyAd_sQCYfImA_PL0eXFkVDo8fJb9Gcznv0',
		maxResults : (options.limit < 5 ? 5 : options.limit),
		part :  'snippet',
		q : options.query,
		type :  'video',
		videoCategoryId :  '10',
		//videoLicense :  'creativeCommon,youtube'
	};

	youtubeApi.search.list(opt, function(err, data){
		if(!data || !data.items || data.items.length == 0) done(err);
		else {
			var result = [];
			for(var i in data.items){
				if (options.title ? data.items[i].snippet.title.toLowerCase().indexOf(options.title.toLowerCase()) > -1 : true &&
						options.artist ? data.items[i].snippet.title.toLowerCase().indexOf(options.artist.toLowerCase()) > -1 : true
				 ){
					result.push(map(data.items[i]));
					if(options.limit == 1) break;
				}
			}
			done(err, result);
		}
	});
};

Provider.prototype.searchByUrl = function(url, done){

	var match = url.href.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
	var id = (match&&match[1].length==11)? match[1] : null;
	var options = {
		auth: 'AIzaSyAd_sQCYfImA_PL0eXFkVDo8fJb9Gcznv0',
		part: 'snippet',
		id: id
	};
	youtubeApi.videos.list(options, function(err, data){
		if(!data || !data.items || data.items.length == 0) done(err);
		else done(err, map(data.items[0]));
	});
};

var map = function(data){
	if(!data) return {};

	var title = data.snippet.title.replace(/ *\([^)]*\) */g, " ").replace(/ *\[[^)]*\] */g, "").split('-');
	var artist = title.shift().trim();
	var name = title.length ? title.shift().trim() : undefined;

	var track = new models.Track({
		title: name,
		artist: new models.Artist({name: artist}, new models.Service({name: "youtube"})),
		album: new models.Album(),
		services: [new models.Service({
			id: data.id.videoId || data.id,
			name: 'youtube',
			url: 'https://www.youtube.com/watch?v=' + data.id.videoId,
			artwork: data.snippet.thumbnails.high.url
		})]
	});

	return track;
};

module.exports = new Provider();
