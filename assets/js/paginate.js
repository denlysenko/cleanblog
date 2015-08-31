'use strict';

(function($) {
	var page = 1;

	$('[data-action = paginate]').click(function(e) {
		e.preventDefault();

		page++;

		$.ajax({
			method: 'GET',
			url: '/page/' + page,
			success: function(response) {
				$('.pager').before(response);
			}
		});
	});
})(jQuery);