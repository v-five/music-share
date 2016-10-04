/**
 * Created by Vityka on Jan, 23.
 */

var Providers = require('../providers');
var Playlist = require('../models').Playlist;
module.exports.post = function(req, res){
	var providers = new Providers();
	if(!req.body.url && !req.body.title && !req.body.tracks) res.status(400).send("The request doesn't contain necessary data.");
	var provider = providers.getByUrl(require('url').parse(req.body.url));
	var ids = req.body.tracks;
	var plUrl = req.body.url;

	if(!provider)  res.status(400).send("This provider is not supported yet.");

	var playlist = new Playlist();
	playlist.title = req.body.title;

	var result = [];
	for(var i in ids){
		result.push(
			new Promise(function(resolve, reject){
				providers.getTrackByProviderId(provider, ids[i], function(errors, track){
					if(errors) reject(errors);
					resolve(track);
				});
			})
		);
	}

	Promise.all(result).then(tracks => {
	  playlist.tracks = tracks;
		playlist.save(function(err, data){
			if(err) res.status(404).send(err);
			res.json(data);
		});
	});
};
