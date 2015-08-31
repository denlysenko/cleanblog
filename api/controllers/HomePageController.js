/**
 * HomePageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

	save: function(req, res) {

		HomePage.find().exec(function(err, docs) {
			// if no records found create new one
			if(!docs.length) {
				var path = require('path').resolve(sails.config.appPath, './assets/images/headings');
				req.file('image').upload({
					dirname: path,
				  saveAs: 'home-bg'
				},function (err, uploadedFiles) {
					// if error ocurred
				  if (err) return res.serverError(err);

				  // if no uploaded files
				  if (uploadedFiles.length === 0){
			      req.flash('message', 'No files was uploaded');
			      return res.redirect('/private/home');
			    }

			    // create record
			    var homePage = _.clone(req.params.all());

			    // take first element of an array because we surely know that only one file is uploading
			    var fd = uploadedFiles[0].fd;
			    
			    var index = fd.indexOf('assets');
			    homePage.imageUrl = fd.slice(index + 6);
			    HomePage.create(homePage, function(err) {
			    	if(err) return res.serverError(err);
			    	res.redirect('/private/home');
			    });
				});
			} else { // if record exists

				var homePage = docs[0];

		    // extend record with new props
		    _.extend(homePage, req.params.all());
				
				var path = require('path').resolve(sails.config.appPath, './assets/images/headings');

				req.file('image').upload({
				  dirname: path,
				  saveAs: 'home-bg'
				},function (err, uploadedFiles) {
					// if error ocurred
				  if (err) return res.serverError(err);
				  
				  if (uploadedFiles.length === 0) { // if no uploaded files

			      homePage.save(function(err) {
				    	if(err) return res.serverError(err);
				    	res.redirect('/private/home');
				    });

			    } else { // if uploading new image
			    	// take first element of an array because we surely know that only one file is uploading
				    var fd = uploadedFiles[0].fd;
				    
				    var index = fd.indexOf('assets');
				    // add new imageUrl
				    homePage.imageUrl = fd.slice(index + 6);

				    homePage.save(function(err) {
				    	if(err) return res.serverError(err);
				    	res.redirect('/private/home');
				    });
			    }
				});
			}
		});
	}
};



