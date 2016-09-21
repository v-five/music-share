
module.exports = {
	set : {
		app         : function(app){
						require('./app')(app);
					},
		router      : function(app){
						require('./router')(app);
					},
		passport    : function(passport){
						require('./passport')(passport);
					},
		mongoose    : function(mongoose){
						require('./mongoose')(mongoose);
					}
	}
};
