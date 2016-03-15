/**
 * LampController
 *
 * @description :: Server-side logic for managing Lamps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var socketman = sails.hooks&&sails.hooks.socketman;

module.exports = {
	changeLampConfig: function(req,res){

		var allParams = req.allParams() || {};
		Object.keys(allParams).forEach(function(oneParam){
			switch (oneParam){
				case 'tweets':
					if (allParams[oneParam] === true){
						socketman.tweets = true;
					}
					else if (allParams[oneParam] === false){
						socketman.tweets = false;
					}
				break;
				default:break;

			}
		});

		// console.log('Changed tweets to:',allParams[oneParam]);

		console.log('changeLampConfig:',req.allParams());
		return res.ok();
	},
	executeLampCommand: function(req,res){

		var allParams = req.allParams();
		Object.keys(allParams).forEach(function(oneParam){
			switch (oneParam){
				case 'fadedown':
					socketman.fadedown(allParams[oneParam])
				break;
				case 'fadeup':
					socketman.fadeup(allParams[oneParam])
				break;
				case 'pulse':
					socketman.pulse(allParams[oneParam])
				break;
				case 'setRed':
					socketman.setRed(allParams[oneParam])
				break;
				case 'setWhite':
					socketman.setWhite(allParams[oneParam])
				break;
				case 'freakout':
					socketman.freakout(allParams[oneParam])
				break;
				case 'setFreakLevel':
					socketman.setFreakLevel(allParams[oneParam])
				break;
				case 'level':
					socketman.level(allParams[oneParam])
				break;
				default:break;
			}
		});

		console.log('executeLampCommand:',req.allParams());
		return res.ok();
	}
};

