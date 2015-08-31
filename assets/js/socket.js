(function($, io) {

	function onMessage(message) {
		
		var userId = message.id;
		updateDom(userId, message);

		if(message.verb !== 'destroyed') {
			displayFlash(message);
		}
	}

	function updateDom(userId, message) {
		// What page am I on?
	  var page = document.location.pathname;

	  // Strip trailing slash if we've got one
	  page = page.replace(/(\/)$/, '');
	  
	  // Route to the appropriate user update handler based on which page you're on
	  switch (page) {

	    // If we're on the User Administration Page (a.k.a. user index)
	    case '/user':

	      // This is a message coming from publishUpdate
	      if (message.verb === 'updated') {
	        UserIndexPage.updateUser(userId, message);
	      }

	      // This is a message coming from publishCreate
	      if(message.verb === 'created') {
	        UserIndexPage.addUser(message);
	      }
	      // This is a message coming publishDestroy
	      if(message.verb === 'destroyed') {
	        UserIndexPage.destroyUser(userId);
	      }
	      break;
	  }
	}

	function displayFlash(message) {
	  $(".navbar").before("<div class='alert alert-success'>" + message.data.name + message.data.action + "</div>");
	  $(".alert").fadeOut(5000);
	}

	var UserIndexPage = {
		updateUser: function(userId, message) {
			var $icon = $('[data-user-id = ' + userId + '] .status i');
			if(message.data.loggedIn) {
				$icon.removeClass('glyphicon-remove').addClass('glyphicon-ok');
			} else {
				$icon.removeClass('glyphicon-ok').addClass('glyphicon-remove');
			}
		},

		addUser: function(message) {
			var obj = {
      	user: message.data
      };
			// Add the template to the bottom of the User Administration Page
	    $( 'tr:last' ).after(
	      // This is the path to the templates file
	      JST['assets/templates/addUser.ejs']( obj )
	    );
		},

		destroyUser: function(userId) {
			$('[data-user-id=' + userId + ']').remove();
		}
	};

	io.socket.on('connect', function() {
		io.socket.on('user', onMessage);
		io.socket.get('/user/subscribe');
	});
})(jQuery, window.io);