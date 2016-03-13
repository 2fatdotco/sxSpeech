var async=require('async');
var _=require('lodash');
var Twit = require('twit');

var client;

var retweet = function(tweet,callback){
	return client.post('statuses/retweet/:id', {id:tweet.id_str}, function(err){
		if (err){
			sails.log('retweet error:',err);
		}
		return;
	});
};

var doTweet = function(thingToSay,callback){

	client.post('statuses/update', { status: thingToSay }, function(err, data, response) {
		if (err){
			console.log('Nope!');
			return callback(err);
		}

		else {
			return callback(null,response);
		}

	});
};

var handleTweet = function(tweet){
	var tweetText = tweet&&tweet.text;

	// Ignore tweets/retweets by @2fatdotco 
	if (tweet.user&&tweet.user.id !== 4918421904){
		// Only fire the lamps if it hasnt been disabled in the admin dashboard.
		if (sails.hooks.socketman.tweets === true){
			sails.hooks.socketman.blastRandom();
		}

		retweet(tweet,function(){
			Tweet
			.create(tweet)
			.exec(function(err,tweetRecord){
				console.log('Tweet saved and retweeted');
			});
		});
	}
	else {
		console.log('Retweeted!');
	}
};

module.exports = function(sails){

	var twitConfig = {
		'consumer_key': process&&process.env&&process.env['TWITTER_CONSUMER_KEY'] || sails.config.twitter['TWITTER_CONSUMER_KEY'],
		'consumer_secret': process&&process.env&&process.env['TWITTER_CONSUMER_SECRET'] || sails.config.twitter['TWITTER_CONSUMER_SECRET'],
		'access_token': process&&process.env&&process.env['TWITTER_ACCESS_TOKEN'] || sails.config.twitter['TWITTER_ACCESS_TOKEN'],
		'access_token_secret': process&&process.env&&process.env['TWITTER_ACCESS_TOKEN_SECRET'] || sails.config.twitter['TWITTER_ACCESS_TOKEN_SECRET']
	};

	if (!!twitConfig['TWITTER_CONSUMER_KEY']){
		client = new Twit(twitConfig);

		var stream = client.stream('statuses/filter', { track: '#InnovationAwards', language: 'en' });

		stream.on('tweet', handleTweet);

		return {
			tweet: doTweet,
			retweet: retweet
		};
	}

	else {
		return {};
	}

}(sails);


// { id: 4918421904,
//   id_str: '4918421904',
//   name: '2fat',
//   screen_name: '2fatdotco',
//   location: null,
//   url: null,
//   description: null,
//   protected: false,
//   verified: false,
//   followers_count: 5,
//   friends_count: 21,
//   listed_count: 0,
//   favourites_count: 0,
//   statuses_count: 2,
//   created_at: 'Wed Feb 17 00:03:39 +0000 2016',
//   utc_offset: null,
//   time_zone: null,
//   geo_enabled: false,
//   lang: 'en',
//   contributors_enabled: false,
//   is_translator: false,
//   profile_background_color: 'F5F8FA',
//   profile_background_image_url: '',
//   profile_background_image_url_https: '',
//   profile_background_tile: false,
//   profile_link_color: '2B7BB9',
//   profile_sidebar_border_color: 'C0DEED',
//   profile_sidebar_fill_color: 'DDEEF6',
//   profile_text_color: '333333',
//   profile_use_background_image: true,
//   profile_image_url: 'http://pbs.twimg.com/profile_images/699747644034318336/z3zskLgc_normal.png',
//   profile_image_url_https: 'https://pbs.twimg.com/profile_images/699747644034318336/z3zskLgc_normal.png',
//   default_profile: true,
//   default_profile_image: false,
//   following: null,
//   follow_request_sent: null,
//   notifications: null }
//   