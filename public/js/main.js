$(document).on('click', '.js-print', function (e) {
	var tag = $(this).attr('data-tag');
	var filename = $(this).attr('data-filename');
	$.get('/sendJob', { tag: tag, filename: filename })
		.done(function ( data ) {
			if (data.success) {
				$('.js-alert').text('Erfolgreich abgesendet ' + data.id).show();
				setTimeout(function () {
					$('.js-alert').hide();
				}, 5000);
			} else {
				$('.js-alert-danger').text('Error2: ' + data.message).show();
				setTimeout(function () {
					$('.js-alert-danger').hide();
				}, 5000);
			}
		}).fail(function (err) {
		$('.js-alert-danger').text('Error1 : ' + err).show();
		setTimeout(function () {
			$('.js-alert-danger').hide();
		}, 5000);
	});
});
