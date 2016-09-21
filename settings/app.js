
// app config
module.exports = function(app){
	var mongoose     = require('mongoose');
	var bodyParser   = require('body-parser');
	var passport     = require('passport');
	var set          = require('../settings').set;

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	set.mongoose(mongoose);
	//set.passport(passport);

	set.router(app);
};
