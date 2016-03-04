var bcrypt = require('bcryptjs');

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

	// If there isn't an admin user in the database, make one.

	sails.after('hook:orm:loaded', function() {
		User
		.find()
		.limit(1)
		.exec(function(err,users){
			if (err){
				sails.log(err);
				return cb();
			}

			if (!users.length){

				var createThisUser = {
					email: process&&process.env&&process.env['DEFAULT_ADMIN_EMAIL'] || 'admin@2fat.co',
					username: process&&process.env&&process.env['DEFAULT_ADMIN_USERNAME'] || 'admin',
					avatarUrl: 'http://l-userpic.livejournal.com/89005287/9857739'
				};

				bcrypt.genSalt(12, function(err, salt) {

					bcrypt.hash(process&&process.env&&process.env['DEFAULT_ADMIN_PASS'] || 'superGoodPassword', salt, function(err, hash) {
						if (err){
							return err;						
						}

						createThisUser.password = hash;

						User
						.create(createThisUser)
						.exec(function(err,user){
							if (err){
								sails.log(err);
							}
							return cb();
						});
					});
				});
			}
			else {
				return cb();
			}
		});
	});
};
