
var uuid = require('../utils').generateUID();
module.exports = {
	secret : function(){
		return uuid;
	}
};
