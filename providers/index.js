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

Providers.prototype.getTrackByProviderId = function(provider, id, done){
	var providers = this;
	provider.searchById(id, function(err, track){
		if(err) return done([err]);
		else providers.matchTrack(track, done);
	});
}

Providers.prototype.search = function(options, done){
	if(!options.query) done("Query should be provided.");
	var _this = this;
	var providers = _this.toList().slice();
	var result = [];
	for(var i in providers){
		result.push(new Promise(function(resolve, reject){
			providers[i].search(options, function(err, tracks){
				if(err) reject(err);
				resolve(tracks);
			});
		}));
	}

	Promise.all(result).then(
		tracksList => {
			var tracks = [];
			var matched = [];
			for(var i in tracksList)
				tracks.push.apply(tracks, tracksList[i]);

			for(var i in tracks){
				matched.push(new Promise(function(resolve, reject){
					_this.matchTrack(tracks[i], function(err, track){
						if(err) reject(err);
						resolve(track);
					});
				}));
			}

			Promise.all(matched).then(
				tracks => { done(false, tracks); },
				errors => { done(errors); }
			);
		},
		errors => { done(errors); }
	);
};

Providers.prototype.match = function(url, done){
	url = require('url').parse(url);
	var providers = this;
	var provider = providers.getByUrl(url);
	if(!provider) return done("We don't support " + url.hostname + " yet.");
	provider.searchByUrl(url, function(err, track){
		if(err) done([err]);
		else providers.matchTrack(track, done);
	});
}

Providers.prototype.matchTrack = function(track, done){
	var providers = this.toList().filter(function(value){return value.shortName != track.services[0].name}).slice();
	repo.Tracks.findById(track.services[0].id, function(error, result){
		if(error || result)
			return done(error ? [error] : false, result);

		var result = [];
		for(var i in providers){
			result.push(
				new Promise(function(resolve, reject){
					providers[i].match(track, function(error, data){
						if(error) reject(error);
						else resolve(data);
					})
				})
			)
		}

		Promise.all(result).then(
			tracks => {
				for(var i in tracks){
					if(!tracks[i]) continue;
					track.services.push(tracks[i].services[0]);
					if(tracks[i].services[0].name != 'youtube'){
						track.album.services.push(tracks[i].album.services[0]);
						track.artist.services.push(tracks[i].artist.services[0]);
					}
				}

				track.save(function(err, data){
					if(err) done(err);
					else done(false, data);
				});
			},
			errors => { done(errors); }
		);
	});
}

module.exports = Providers;
