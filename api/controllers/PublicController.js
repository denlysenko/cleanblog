/**
 * PublicController
 *
 * @description :: Server-side logic for managing publics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res) {
		async.series([
			function(done) {
				HomePage.find(done);
			},
			function(done) {
				Post.find().sort('updatedAt DESC').limit(2).exec(done);
			}
		], function(err, results) {
			if(err) return res.serverError(err);
			res.view('homepage', {
				title: 'Clean Blog',
				home: results[0][0],
				posts: results[1],
				moment: require('moment')
			});
		});
	},

	page: function(req, res) {

		Post.find()
			.sort('updatedAt DESC')
			.paginate({page: req.param('page'), limit: 2})
			.exec(function(err, posts) {
				if(err) return res.serverError(err);
				res.view('partials/post-list', {
					posts: posts,
					moment: require('moment'),
					layout: false
				});
			});
	},

	about: function(req, res) {
		AboutPage.find({}).exec(function(err, docs) {
			if(err) return res.serverError(err);
			res.view('about', {
				title: 'About Me',
				aboutPage: docs[0] // we know that there is only one document
			});
		});
	},

	contact: function(req, res) {
		res.view('contact', {
			title: 'Contact Me'
		});
	},

	sendMessage: function(req, res) {
		console.log(req.params.all());
		// TODO sending mail with the message through Nodemailer.js
		res.ok();
	}
};

