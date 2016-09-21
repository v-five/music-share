/**
 * Created by Vityka on Feb, 28.
 */

var Track = require('../models').Track;
var Tracks = function() {};

Tracks.prototype.findById = function(id, done){
  Track.findOne({'services.id': id}).populate('artist album').exec(done);
};
Tracks.prototype.find = Track.find;
Tracks.prototype.add = function(track, done){
    newTrack.save(done);
};

module.exports = new Tracks();
