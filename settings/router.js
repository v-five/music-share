/**
 * Created by Vityka on Jan, 23.
 */

module.exports = function(app){
	var routes = require('../routes');

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.use('/api/dev/search', routes.search);
	app.use('/api/dev/match', routes.match);

	app.get('/', function(req, res){
		res.send('Welcome to my API!');
	});
};
