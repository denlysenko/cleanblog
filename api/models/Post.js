/**
* Post.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	schema: true,

  attributes: {
  	title: {
  		type: 'string',
  		defaultsTo: ''
  	},

  	subtitle: {
  		type: 'string',
  		defaultsTo: ''
  	},

  	headerUrl: {
  		type: 'string',
  		defaultsTo: ''
  	},

  	author: {
  		type: 'string',
  		defaultsTo: ''
  	},

  	body: {
  		type: 'string',
  		defaultsTo: ''
  	},

  	slug: {
  		type: 'string'
  	},

  	imageUrls: {
  		type: 'array'
  	}
  }
};

