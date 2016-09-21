
var auth = require('../config').externalAuth.google;
var PlayMusic = require('playmusic');

PlayMusic.prototype.isInitialized = false;

PlayMusic.prototype.initialize = function(options, done){
	if(typeof options === 'function'){
		done = options;
		options = {};
	}

	if(this.isInitialized) done(false);
	else {
		var that = this;
		var username = options.username || auth.username;
		var password = options.username || auth.password;
		var androidId = options.androidId || auth.deviceId;

		this.login({email: username, password: password, androidId: androidId}, function (err, tokens) {
			if (err) done(err);
			else {
				that.isInitialized = true;
				that.init(tokens, done);
			}
		});
	}
}

module.exports = new PlayMusic();
