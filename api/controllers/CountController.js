/**
 * CountController
 *
 * @description :: Server-side logic for managing counts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var socketman = sails.hooks.socketman;

module.exports = {
	'registerCount': function(req,res){

		var count = req.param('count');
		console.log('Got it!',count,req.allParams());

		socketman.blastAll("{\"level\":"+count+"}");
		return res.ok();
	}
};

