/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	one: function(req, res) {
		Post.findOneBySlug(req.param('slug'), function(err, post) {
			if(err) return res.serverError(err);
			res.view('post', {
				post: post,
				title: post.title,
				moment: require('moment')
			});
		});
	},

	new: function(req, res) {
		res.view('private/new', {
			layout: 'private/layout',
			title: 'Add New Post', 
			path: req.url,
			imageUrls: req.flash('imageUrls'),
			post: '',
			message: req.flash('message')
		});
	},

	upload: function(req, res) {
		var path = require('path').resolve(sails.config.appPath, './assets/images/posts');
		req.file('images').upload({
			dirname: path,
			saveAs: function(_newFileStream, callback) {
				callback(null, _newFileStream.filename)
			}
		}, function(err, uploadedFiles) {
			// if error ocurred
		  if (err) return res.serverError();

		  // if no uploaded files
		  if (uploadedFiles.length === 0){
		  	req.flash('message', 'No files was uploaded');
	      return res.redirect('back');
	    }

	    var files = [];

	    async.each(uploadedFiles, function(file, done) {
	    	var fd = file.fd;
		    var index = fd.indexOf('assets');
		    files.push(fd.slice(index + 6));
		    done();
	    }, function(err) {
	    	if(err) return res.serverError(err);
	    	var post = {
	    		imageUrls: files,
	    		author: req.session.me.username
	    	};

	    	Post.create(post, function(err, post) {
	    		if(err) return res.serverError(err);
	    		// save urls into flash message to show them on the page after redirecting
	    		req.flash('imageUrls', files);
	    		// save imageUrls to get access to them if an error occur during create action
	    		req.session.images = files;
	    		res.view('private/edit', {
						layout: 'private/layout',
						title: 'Add New Post', 
						path: req.url,
						imageUrls: req.flash('imageUrls'),
						post: post,
						message: req.flash('message')
					});
	    	});
	    });
		});
	},

	create: function(req, res) {
		var post = _.clone(req.params.all());
		post.slug = post.title.toLowerCase().replace(',', '').replace(/\s+/g, '-');
		post.author = req.session.me.username;

		var path = require('path').resolve(sails.config.appPath, './assets/images/headings');

		req.file('header').upload({
			dirname: path,
		  saveAs: function(_newFileStream, callback) {
				callback(null, _newFileStream.filename)
			}
		},function (err, uploadedFiles) {
			// if error ocurred
		  if (err) return res.serverError(err);

		  // if no uploaded files
		  if (uploadedFiles.length === 0){
	      Post.create(post, function(err) {
					if(err) return res.serverError(err);
					User.publishUpdate(req.session.me.id, {
						name: req.session.me.username,
						action: ' has created new post'
					});
					req.session.images = null;
					res.redirect('/private/posts');
				});
	    } else {
	    	// take first element of an array because we surely know that only one file is uploading
		    var fd = uploadedFiles[0].fd;
		    
		    var index = fd.indexOf('assets');
		    var headerUrl = fd.slice(index + 6);
		   	
				post.headerUrl = headerUrl;

				Post.create(post, function(err) {
					if(err) return res.serverError(err);
					User.publishUpdate(req.session.me.id, {
						name: req.session.me.username,
						action: ' has created new post'
					});
					req.session.images = null;
					res.redirect('/private/posts');
				});
	    }
		});
	},

	update: function(req, res) {
		Post.findOneById(req.param('id'), function(err, post) {
			if(err) return res.serverError(err);
			if(!post) return res.notFound({message: 'Post not found'});

			var path = require('path').resolve(sails.config.appPath, './assets/images/headings');
			_.extend(post, req.params.all());
			post.slug = post.title.toLowerCase().replace(',', '').replace(/\s+/g, '-');

			req.file('header').upload({
				dirname: path,
			  saveAs: function(_newFileStream, callback) {
					callback(null, _newFileStream.filename)
				}
			},function (err, uploadedFiles) {
				// if error ocurred
			  if (err) return res.serverError(err);

			  // if no uploaded files
			  if (uploadedFiles.length === 0){

		      post.save(function(err) {
						if(err) return res.serverError(err);
						User.publishUpdate(req.session.me.id, {
							name: req.session.me.username,
							action: ' has created new post'
						});
						// clear session images array
						req.session.images = null;
						res.redirect('/private/posts')
					});
		    } else {
		    	// take first element of an array because we surely know that only one file is uploading
			    var fd = uploadedFiles[0].fd;
			    
			    var index = fd.indexOf('assets');
			    var headerUrl = fd.slice(index + 6);
			   	
					post.headerUrl = headerUrl;

					post.save(function(err) {
						if(err) return res.serverError(err);
						User.publishUpdate(req.session.me.id, {
							name: req.session.me.username,
							action: ' has created new post'
						});
						// clear session images array
						req.session.images = null;
						res.redirect('/private/posts')
					});
		    }
			});
		});
	},

	removeImage: function(req, res) {
		Post.findOneById(req.param('id'), function(err, post) {
			post.imageUrls.splice(post.imageUrls.indexOf(req.param('url')), 1);
			var path = require('path').normalize(sails.config.appPath + '/.tmp/public' + req.param('url'));
			require('fs').unlink(path, function(err) {
				if(err) return res.serverError(err);
				post.save(function(err) {
					if(err) return res.serverError(err);
					res.ok();
				});
			});
		});
	},

	destroy: function(req, res) {
		Post.findOneById(req.param('id'), function(err, post) {
			if(err) return res.serverError(err);
			if(!post) res.notFound({message: 'Post not found'});

			//removing all images with fs module
			if(post.imageUrls.length) {
				async.each(post.imageUrls, function(url, done) {
					var path = require('path').normalize(sails.config.appPath + '/.tmp/public' + url);
					require('fs').unlink(path, done);
				}, function(err) {
					if(err) return res.serverError(err);4
					// remove header image
					var path = require('path').normalize(sails.config.appPath + '/.tmp/public' + post.headerUrl);
					require('fs').unlink(path, function(err) {
						if(err) return res.serverError(err);
						Post.destroy({id: post.id}, function(err) {
							if(err) return res.serverError(err);
							User.publishUpdate(req.session.me.id, {
								name: req.session.me.username,
								action: ' has removed post'
							});
							res.redirect('/private/posts');
						});
					});
				});
			} else {
				var path = require('path').normalize(sails.config.appPath + '/.tmp/public' + post.headerUrl);
				require('fs').unlink(path, function(err) {
					if(err) return res.serverError(err);
					Post.destroy({id: post.id}, function(err) {
						if(err) return res.serverError(err);
						User.publishUpdate(req.session.me.id, {
							name: req.session.me.username,
							action: ' has removed post'
						});
						res.redirect('/private/posts');
					});
				});
			}
		});
	}
};

