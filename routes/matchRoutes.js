/**
 * Created by Vityka on Jan, 23.
 */

module.exports = function(){
	var express = require('express');
	var matchController = require('../controllers').match;
	var matchRouter = express.Router();

	matchRouter.route('/')
		.post(matchController.post);

	return matchRouter;
};
