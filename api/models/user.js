var bcrypt = require('bcryptjs');


module.exports = {
  attributes: {
    email: {
      unique: true
    },
    username: {
    	unique: true
    }
  },

  beforeUpdate: function(vals,done){
    // If a password is passed in, hash it before continuing
    if (vals.password) {
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(vals.password, salt, function(err, hash) {
            if (err) return err;

            vals.password = hash;
            return done();
          });
      });
    } else {
      return done();
    }
  }

};