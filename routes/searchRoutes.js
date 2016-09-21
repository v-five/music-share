/**
 * Created by Vityka on Jan, 23.
 */

module.exports = function(){
	var express = require('express');
	var searchController = require('../controllers').search;
	var searchRouter = express.Router();

	searchRouter.route('/')
		.get(searchController.get);

	return searchRouter;
};
