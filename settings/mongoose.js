
module.exports = function(mongoose){
	var db  = require('../config').database;
	mongoose.Promise = Promise;
	return mongoose.connect(db.url.mongolab);
};
