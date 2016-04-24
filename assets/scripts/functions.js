// think about making this getUrlParameter and creds one object called... creds,
// just have getUrlParameter as a function that is called within the client_id and 
// client_secret function
var getUrlParameter = function getUrlParameter(sParam) {

  var sPageURL = decodeURIComponent(window.location.search.substring(1));
  var sURLVariables = sPageURL.split('&');
  var sParameterName;
  var i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};

var creds = {
	client_id : function() {
		return getUrlParameter('id') || 'xeLjwzcBZlpB1FxcTvQeN';
	},
	client_secret : function() {
		// if its live
		if (getUrlParameter('secret') || window.location.hostname == 'weather.brett-marshall.com') {
			return 'qPjiDGfctvbRVT0xlPpbhumYgf97VtfbylQP6sSN';
		} else { // if we're in dev environment
			return 'dSL0o3LFRHpvvkXcfGloWJwcYIrGSgbwBzgPZDCU';
		}		
	}
};



// This kicks off the entire app
if (Cookies.get('cache-geolocation')) {

	Arbiter.publish('location_obtained.global', Cookies.get('cache-geolocation'));

} else {

	// get the current location
	navigator.geolocation.getCurrentPosition(function (position) {
		// notify the rest of the app, the location has been obtained
		// provide the long + lat in the following format  |  -31.444, 95.3305
	    Cookies.set('cache-geolocation', position.coords.latitude + ', ' + position.coords.longitude);
	    Arbiter.publish('location_obtained.global', position.coords.latitude + ', ' + position.coords.longitude);
	});

}



function get_city(coords) {

	var lat = coords.split(', ')[0],
		long = coords.split(', ')[1];

	var geocoder = new google.maps.Geocoder();
	var latlong = new google.maps.LatLng(lat, long);

	geocoder.geocode({
	    'latLng': latlong
	}, function(results, status) {

	    if (status == google.maps.GeocoderStatus.OK) {
	    	var city = results[0].address_components[2].long_name;
	        Arbiter.publish('city_obtained.global', [city, coords] );
	    } else {

	    }
	});
}

Arbiter.subscribe('location_obtained.global', get_city);




// function to generate a random number range.
function randRange( minNum, maxNum) {
	return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// function to generate drops
function createRain(nbDrop, inten) {
	nbDrop = nbDrop || 50;
	inten = inten || '';

	for( i=1;i<nbDrop;i++) {
		var dropLeft = randRange(0,1600);
		var dropTop = randRange(-1000,1400);
		var thisDrop = $('#drop'+i);

		$('.app-top__weather-conditions').append('<div class="drop" id="drop'+i+'"></div>');
		$('#drop'+i).css('left',dropLeft);
		$('#drop'+i).css('top',dropTop);
		$('#drop'+i).addClass(inten);
	}

}