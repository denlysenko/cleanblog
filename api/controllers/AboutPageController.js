/**
 * AboutPageController
 *
 * @description :: Server-side logic for managing aboutpages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

	save: function(req, res) {

		AboutPage.find().exec(function(err, docs) {
			// if no records found create new one
			if(!docs.length) {
				var path = require('path').resolve(sails.config.appPath, './assets/images/headings');
				req.file('image').upload({
					dirname: path,
				  saveAs: 'about-bg'
				},function (err, uploadedFiles) {
					// if error ocurred
				  if (err) return res.negotiate(err);

				  // if no uploaded files
				  if (uploadedFiles.length === 0){
				  	req.flash('message', 'No files was uploaded');
			      return res.redirect('back');
			    }

			    // create record
			    var aboutPage = _.clone(req.params.all());

			    // take first element of an array because we surely know that only one file is uploading
			    var fd = uploadedFiles[0].fd;
			    
			    var index = fd.indexOf('assets');
			    aboutPage.imageUrl = fd.slice(index + 6);
			    AboutPage.create(aboutPage, function(err) {
			    	if(err) return res.negotiate(err);
			    	res.redirect('/private/about');
			    });
				});
			} else { // if record exists

				var aboutPage = docs[0];

		    // extend record with new props
		    _.extend(aboutPage, req.params.all());
				
				var path = require('path').resolve(sails.config.appPath, './assets/images/headings');

				req.file('image').upload({
				  dirname: path,
				  saveAs: 'about-bg'
				},function (err, uploadedFiles) {
					// if error ocurred
				  if (err) return res.negotiate(err);
				  
				  if (uploadedFiles.length === 0){ // if no uploaded files

			      aboutPage.save(function(err) {
				    	if(err) return res.negotiate(err);
				    	res.redirect('/private/about');
				    });

			    } else { // if uploading new image
			    	// take first element of an array because we surely know that only one file is uploading
				    var fd = uploadedFiles[0].fd;
				    
				    var index = fd.indexOf('assets');
				    // add new imageUrl
				    aboutPage.imageUrl = fd.slice(index + 6);

				    aboutPage.save(function(err) {
				    	if(err) return res.negotiate(err);
				    	res.redirect('/private/about');
				    });
			    }
				});
			}
		});
	}
};

