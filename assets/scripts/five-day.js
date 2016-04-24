/*=====================================================
=            5 Day Forcast in Bottom Panel            =
=====================================================*/


var fiveDayForcast = (function() {
	
	// get data
	function get_request(loc) {
		var city = loc[0],
			coords = loc[1];

		$.ajax({
			url: "http://api.aerisapi.com/forecasts/" + coords + "?filter=24hr&limit=5&client_id=" + creds.client_id() + "&client_secret=" + creds.client_secret(),
			dataType: "jsonp",
			success: function(json) {
				if (json.success === true) {					
					Arbiter.publish('aries_data_retreaved.five-day', json.response);
				}
				else {
					console.log(json.error.description);
				}
			}
		});		
	}	


	// structure data the way we want it
	function parse_request(response) {		

		// returns an array of objects, essentially they are days
		var days = response.map(function(elem) {
			return elem.periods;
		});

		days = days[0]; // enters array, to have direct access to objects

		for (var a = days.length - 1; a >= 0; a--) {           

		  var fiveDayDate = new Date(days[a].validTime);
		  days[a].day = weekday[fiveDayDate.getDay()];
		  days[a].newIcon = days[a].icon.replace('png', 'svg');

		}

		Arbiter.publish('weather-ready.five-day', days);
	}



	var fiveDayVue = new Vue({
		el : '#five-day',
		data : { fiveDay : [] }
	});

	function attach(parsed_data) {

		fiveDayVue.fiveDay = parsed_data;

	}	


	// getting the location data
	Arbiter.subscribe('city_obtained.global', get_request);
	// getting the 5 day forcast associated with the location
	Arbiter.subscribe('aries_data_retreaved.five-day', parse_request);
	// once the data has been parsed, attach it to the vue instance
	Arbiter.subscribe('weather-ready.five-day', attach);
})();