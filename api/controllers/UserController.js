/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	show: function(req, res) {
		User.find().exec(function(err, users) {
			if(err) return res.serverError(err);
			res.view('user/index', {
				layout: 'private/layout',
				path: req.url,
				title: 'Manage Users',
				users: users
			});
		});
	},

	new: function(req, res) {
		res.view('user/new', {
			layout: 'private/layout',
			path: req.url,
			title: 'Create User',
			message: req.flash('message')
		});
	},

	signinForm: function(req, res) {
		res.view('user/signin', {
			layout: false,
			path: req.url,
			title: 'Sign In',
			message: req.flash('message')
		});
	},

	signin: function(req, res) {
		User.findOneByUsername(req.param('username'), function(err, user) {
			if(err) return res.negotiate(err);
			if(!user) {
				req.flash('message', 'User not found');
				return res.redirect('/user/signin');
			};

			if(!req.param('password')) {
				req.flash('message', 'Password is required');
				return res.redirect('/user/signin');
			}

			require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if(err) return res.serverError(err);
				if(!valid) {
					req.flash('message', 'Incorrect password');
					return res.redirect('/user/signin');
				};

				req.session.me = user;
				req.session.authenticated = true;

				user.online = true;

				user.save(function(err) {
					if(err) return res.serverError(err);
					User.publishUpdate(user.id, {name: user.username, action: ' has logged in', loggedIn: true})

					if(user.admin) {
						res.redirect('/private');
					} else {
						res.redirect('/private/posts');
					}
				});
			});
		});
	},

	signout: function(req, res) {

		User.findOneById(req.session.me.id, function(err, user) {
			req.session.me = null;
			req.session.authenticated = false;
			user.online = false;
			user.save(function(err) {
				if(err) return res.serverError(err);
				User.publishUpdate(user.id, {name: user.username, action: ' has logged out', loggedIn: false});
				res.redirect('/');
			});
		});
	},

	create: function(req, res) {
		var userObj = _.clone(req.params.all());
		userObj.admin = (req.param('admin') === 'on') ? true : false;

		User.create(userObj, function(err, user) {
			if(err) {
				req.flash('message', err.message);
				return res.redirect('/user/new');
			}

			user.name = user.username;
			user.action = ' was created';
			User.publishCreate(user);
			res.redirect('/user');
		});
	},

	edit: function(req, res) {
		User.findOneById(req.param('id'), function(err, user) {
			if(err) return res.serverError(err);
			if(!user) return res.notFound('User not Found');

			res.view('user/edit', {
				layout: 'private/layout',
				path: req.url,
				title: 'Edit User',
				user: user
			});
		});
	},

	save: function(req, res) {
		User.findOneById(req.param('id'), function(err, user) {
			if(err) return res.serverError(err);
			if(!user) return res.notFound({message: 'User not found'});

			_.extend(user, req.params.all());

			user.admin = (req.param('admin') === 'on') ? true : false;

			user.save(function(err) {
				if(err) return res.serverError(err);

				res.redirect('/user');
			});
		});
	},

	destroy: function(req, res) {
		User.findOneById(req.param('id'), function(err, user) {
			if(err) return res.serverError(err);
			if(!user) return res.notFound({message: 'User not found'});

			User.destroy({id: user.id}, function(err) {
				if(err) return res.serverError(err);
				// this is for notification
				User.publishUpdate(user.id, {
					name: user.username,
					action: ' was destroyed'
				});
				User.publishDestroy(user.id);
				res.ok();
			});
		});
	},

	subscribe: function(req, res) {
		User.find().exec(function(err, users) {
			if(err) return res.serverError(err);
			User.watch(req);
			User.subscribe(req, users);
		});
	}
};

