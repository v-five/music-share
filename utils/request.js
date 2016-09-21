/**
 * Created by Vityka on Jan, 24.
 */

module.exports = function(options,  done){

	var secure = options.protocol == 'https:';

	var http = require('http');
	if(secure)
		http = require('https');

	var req = http.request(options, function(response) {

		var body = '';
		response.on('data', function(chunk) {
			body += chunk;
		});

		response.on('end', function() {
			try{
				done(null, options.json ? JSON.parse(body) : body);
			}catch(e){
				done(e);
			}
		});
	});

	req.on('error', function(e) {
		done(e);
	});

	req.end();
};
