
module.exports = function(length){
	length = length || 24;
	return require('uid')(length);
};
