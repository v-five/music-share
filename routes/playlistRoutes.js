/**
 * Created by Vityka on Jan, 23.
 */

module.exports = function(){
	var express = require('express');
	var playlistController = require('../controllers').playlist;
	var playlistRouter = express.Router();

	playlistRouter.route('/')
		.post(playlistController.post);

	return playlistRouter;
};
