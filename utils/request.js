/**
 * Created by Vityka on Jan, 24.
 */

module.exports = function(options,  done){
	var http = options.protocol == 'https:' ? require('https') : require('http');
	var req = http.request(options, function(response) {
		var body = '';
		response.on('data', function(chunk) {
			body += chunk;
		});

		response.on('end', function() {
			done(false, options.json ? JSON.parse(body) : body);
		});
	});

	req.on('error', function(e) {
		done(e);
	});

	req.end();
};
