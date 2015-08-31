/**
 * PrivivateController
 *
 * @description :: Server-side logic for managing privates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res) {
		if(!req.session.me) {
			res.view('user/signin', {layout: false, title: 'Authentication', message: req.flash('meesage')});
		} else {
			res.view('private/index', {
				layout: 'private/layout',
				title: 'Home Page', 
				path: req.url
			});
		}
	},

	home: function(req, res) {
		HomePage.find().exec(function(err, docs) {
			if(err) return res.serverError(err);
			res.view('private/home', {
				layout: 'private/layout',
				data: docs[0] || '',
				title: 'Home Page', 
				path: req.url,
				message: req.flash('message')
			});
		});
	},

	about: function(req, res) {
		AboutPage.find().exec(function(err, docs) {
			if(err) return res.negotiate(err);
			res.view('private/about', {
				layout: 'private/layout', 
				data: docs[0] || '', 
				title: 'About Page',
				path: req.url,
				message: req.flash('message')
			}); // here can be only one document
		});
	},

	posts: function(req, res) {
		Post.find().sort('updatedAt desc').exec(function(err, posts) {
			if(err) return res.negotiate(err);
			res.view('private/posts', {
				layout: 'private/layout', 
				path: req.url,
				posts: posts,
				title: 'Posts List',
				moment: require('moment')
			});
		});
	},

	edit: function(req, res) {
		Post.findById(req.param('id'), function(err, post) {
			if(err) return res.negotiate(err);
			if(!post) return res.notFound();
			res.view('private/edit', {
				layout: 'private/layout', 
				path: req.url,
				post: post[0],
				imageUrls: req.flash('imageUrls'),
				title: 'Edit Post',
				message: req.flash('message')
			});
		});
	} 
};

