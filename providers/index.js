/**
 * Created by Vityka on Jan, 24.
 */
var repo = require('../repository');
var providersList = [
	require('./gMusic'),
	require('./spotify'),
	require('./youtube'),
	require('./deezer')
];

var Providers = function(){};
Providers.prototype.toList = function(){
	return providersList;
};

Providers.prototype.getByShortName = function(shortName){
	for(var i in providersList)
		if(providersList[i].shortName == shortName) return providersList[i];
	return null;
};

Providers.prototype.getByUrl = function(url){
	return this.getByHostname(url.hostname);
};

Providers.prototype.getByHostname = function(hostname){
	for(var i in providersList)
		if(providersList[i].hostname == hostname) return providersList[i];
	return null;
};

Providers.prototype.search = function(options, done){
	if(options.query) search(this.toList().slice(), options, [], [], done);
	else done("Query should be provided.");
};

Providers.prototype.match = function(url, done){
	url = require('url').parse(url);
	var providers = this;
	var provider = providers.getByUrl(url);
	if(!provider) done("We don't support " + url.hostname + " yet.");
	provider.searchByUrl(url, function(err, track){
		if(err) return done([err]);
		else providers.matchTrack(track, done);
	});
}

Providers.prototype.getTrackByProviderId = function(provider, id, done){
	var providers = this;
	provider.searchById(id, function(err, track){
		if(err) return done([err]);
		else providers.matchTrack(track, done);
	});
}

Providers.prototype.matchTrack = function(track, done){
	var providers = this;
	repo.Tracks.findById(track.services[0].id, function(error, result){
		if(error || result)
			return done(error ? [error] : false, result);

		search(providers.toList().slice(), {title: track.title, artist: track.artist.name}, [], [], function (errors, data) {
			if(data){
				var tracks = filterTracks(data, track);
				for(var i in tracks){
					track.services.push(tracks[i].services[0]);
					if(tracks[i].services[0].name != 'youtube'){
						track.album.services.push(tracks[i].album.services[0]);
						track.artist.services.push(tracks[i].artist.services[0]);
					}
				}
				track.save(function(err, data){
					if(err) errors.push(err);
					if(data) return done(errors, data);
					done(errors, track);
				});
			}
		});
	});
}

var search = function(providers, options, result, errors, done){
	var provider = providers.shift();
	provider.search(options, function(err, data){
		if(err) errors.push({name: provider.shortName, error: err});
		else if(!data) 	errors.push({name: provider.shortName, error: "No tracks found."});
		else result = result.concat(data);

		if(providers.length > 0) search(providers, options, result, errors, done);
		else done(errors, result);
	});
};

var filterTracks = function(tracks, track){
	var filtered = [];
	var unique = {};
	var distinct = [];
	for( var i in tracks ){
		if(tracks[i].services[0].id == track.services[0].id) continue;
		var key = tracks[i].title + " " + tracks[i].artist.name + " " + tracks[i].services[0].name;
		if(!unique[key]){
			distinct.push(tracks[i]);
		}
		unique[key] = true;
	}

	return distinct;
};

module.exports = Providers;
