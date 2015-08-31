/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'PublicController.index',

  '/about': 'PublicController.about',

  'get /contact': 'PublicController.contact',

  'post /contact': 'PublicController.sendMessage',

  'get /post/:slug': 'PostController.one',

  'get /page/:page': 'PublicController.page',

  'post /private/about': 'AboutPageController.save',

  'post /private': 'HomePageController.save',

  'get /private/post/new': 'PostController.new',

  'post /private/post/upload': 'PostController.upload',

  'post /private/post/create/:id?': 'PostController.create',

  'post /private/post/edit/:id': 'PostController.update',

  'delete /private/post/:id/remove_image': 'PostController.removeImage',

  'delete /private/post/:id/destroy': 'PostController.destroy',

  'get /user': 'UserController.show',

  'get /user/new': 'UserController.new',

  'post /user/new': 'UserController.create',

  'get /user/edit/:id': 'UserController.edit',

  'post /user/edit/:id': 'UserController.save',

  'delete /user/destroy/:id': 'UserController.destroy',

  'get /user/signin': 'UserController.signinForm',

  'post /user/signin': 'UserController.signin',

  'get /user/signout': 'UserController.signout',

  'get /user/subscribe': 'UserController.subscribe'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
