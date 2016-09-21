
module.exports = function(passport){
	// var BearerStrategy          = require('passport-http-bearer').Strategy;
	// var User       		        = require('../handler').user;



	// // ****************************************** //
	// // ********* PASSPORT SESSION SETUP ********* //
	// // ****************************************** //

	// // used to serialize the user for the session
	// passport.serializeUser(function(user, done) {
	// 	done(null, user.id);
	// });

	// // used to deserialize the user
	// passport.deserializeUser(function(id, done) {
	// 	User.findById(id, done);
	// });



	// // ****************************************** //
	// // ********** PASSPORT BEARER LOGIN ********* //
	// // ****************************************** //

	// passport.use(new BearerStrategy(
	// 		function(accessToken, done) {
	// 			User.bearerLogin(accessToken, done);
	// 		}
	// ));
};
