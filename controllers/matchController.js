/**
 * Created by Vityka on Jan, 23.
 */

var Providers = require('../providers');
var Track = require('../models').Track;
module.exports.post = function(req, res){
	var providers = new Providers();
	if(!req.body.url) return res.status(400).send("The request doesn't contain any url.");
	providers.match(req.body.url, function(errors, match){
		if(errors) res.status(501).send(errors);
		else if(!match) res.status(404).send("No tracks found!");
		else res.json(match);
	});
};
