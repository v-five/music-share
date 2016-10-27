/**
 * Created by Vityka on Jan, 23.
 */

var Providers = require('../providers');
module.exports.get = function(req, res){
	var providers = new Providers();

	var q = req.query.q;
	if(!q) res.status(400).send("The request doesn't contain any query.");

	providers.search({query:q}, function(errors, data){
		if(errors) res.status(501).send(errors);
		else if(!data) res.status(404).send("No tracks found!");
		else res.json(data);
	});
};
