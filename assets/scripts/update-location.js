/*=======================================
=            Update Location            =
=======================================*/


var update_location = (function() {

	// cache elements
	var update_btn = $('.update-location');


	// trigger the location update
	update_btn.on('click', function() {
		$(this).addClass('reloading');
		Arbiter.publish('location_updating.update_location');
	});


	// get the location, cache the result
	// publish this to stop loader
	// publish this to the rest of the app
	function get_location() {
		navigator.geolocation.getCurrentPosition(function (position) {
			// notify the rest of the app, the location has been obtained
			// provide the long + lat in the following format  |  -31.444, 95.3305
		    Cookies.set('cache-geolocation', position.coords.latitude + ', ' + position.coords.longitude);
		    Arbiter.publish('location_obtained.global', position.coords.latitude + ', ' + position.coords.longitude);
		    Arbiter.publish('location_updated.update_location');
		});	
	}	


	// stop spinning update_btn
	function stop_loader() {
		update_btn.removeClass('reloading');
	}


	Arbiter.subscribe('location_updating.update_location', get_location);
	Arbiter.subscribe('location_updated.update_location', stop_loader);

})();