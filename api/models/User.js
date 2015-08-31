/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	schema: true,

  attributes: {
  	username: {
  		type: 'string',
  		required: true,
  		unique: true
  	},

  	encryptedPassword: {
  		type: 'string'
  	},

  	admin: {
  		type: 'boolean',
  		defaultsTo: false
  	},

  	online: {
  		type: 'boolean',
  		defaultsTo: false
  	}
  },

  beforeCreate: function(values, next) {
  	if(!values.password || !(values.password === values.confirmation)) {
  		return next({message: "Password doesn't match password confirmation."});
  	}

  	require('bcrypt').hash(values.password, 10, function(err, encryptedPassword) {
  		if(err) return next(err);
  		values.encryptedPassword = encryptedPassword;
  		next();
  	});
  }
};

