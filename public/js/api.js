/**
 * Created by Vityka on Feb, 23.
 */

var Api = function() {
	this.host = 'http://localhost/'
	this.url  = this.host + 'api/dev/';
};

Api.prototype.match = function(url, done){
	$.ajax({
		url: this.url + 'match',
		type: "POST",
		data: JSON.stringify({"url": url}),
		contentType:"application/json",
		dataType:"json",
		success: done
	});
};

Api.prototype.search = function(q, done){
	$.ajax({
		url: this.url + 'search?q=' + q,
		type: "GET",
		dataType: "json",
		success: done
	});
};

var api = new Api();
