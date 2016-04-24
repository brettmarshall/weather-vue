/*===========================================
=            Top Panel Component            =
===========================================*/


var todayForcast = (function() {

	var $top = $('#app-top');
	
	// get data
	function get_request(loc) {
		var city = loc[0],
			coords = loc[1];

		$.ajax({
			url: "http://api.aerisapi.com/forecasts/" + coords + "?filter=1hr&limit=1&client_id=" + creds.client_id() + "&client_secret=" + creds.client_secret(),
			dataType: "jsonp",
			success: function(json) {
				if (json.success === true) {					
					Arbiter.publish('aries_data_retreaved.today', json.response);
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
		var today = response.map(function(elem) {
			return elem.periods;
		});

		today = today[0]; // enters array, to have direct access to objects

		Arbiter.publish('weather-ready.today', today);
	}


	function get_svg(today) {

		today = today[0];

		var xhr = new XMLHttpRequest();
		xhr.open("GET", '/assets/images/weather-icons/' + today.icon.replace('png', 'svg'), false);
		xhr.overrideMimeType("image/svg+xml");
		xhr.send();

		today.newIcon = xhr.responseXML.documentElement.outerHTML;		

		Arbiter.publish('svg-ready.today', today);
	}


	function get_clouds(today) {

		today = today[0];

        var cloudBool = new RegExp('cloud', 'i');
        var cloudBoolres = cloudBool.test(today.weather);                


        if (cloudBoolres) {
        	// remove clouds, this comes in handy if you're updating the location
        	// otherwise, it would double the cloud output
    		$('.cloud').remove();
			$('<span class="cloud top left light"></span>').appendTo('.app-top');
			$('<span class="cloud bottom right light-2"></span>').appendTo('.app-top');
        }		

	}


	function get_precipitation(today) {

		today = today[0];

		var weatherCode = today.weatherPrimaryCoded.split(':');

	    var coverage = String(weatherCode[0]),
	        intensity = String(weatherCode[1]),
	        weather = String(weatherCode[2]);

	    var weatherConditions = new RegExp('[asilrwp]', 'i');
	    var res = weatherConditions.test(weather);


        $('.app-top__weather-conditions').remove();

	    // if there is rain...
	    if (coverage !== '' && intensity !== '' && weather !== '' && res) {
      	  
	      // We have some sort of rain or snow...


		  // remove rain, this comes in handy if you're updating the location
		  // otherwise, it would double the rain output

	      var drops = '';
	      // this gets the intensity of the rain, and adds
	      // drops and a class for more customization of the drops
	      switch ('H') {
	        case 'VL':
	          drops = 30;
	          dropIntensity = '';
	          break;
	        case 'L':
	          drops = 100;
	          dropIntensity = 'drop--light';
	          break;
	        case 'H':
	          drops = 350;
	          dropIntensity = 'drop--heavy';
	          break;                                            
	        default:
	          drops = 500;
	          dropIntensity = 'drop--very-heavy';
	          break;
	      }

	      // if the expanded weather string contains the word wind, it rotates
	      // the box that has the drops, 45 degrees.
	      var windPatt = new RegExp('wind', 'i');
	      var windRes = windPatt.test(String(today.weather));

	      $('#today').append('<div class="app-top__weather-conditions"></div>');

	      if (windRes) {
	        $('.app-top__weather-conditions').css('transform', 'rotate(45deg');
	      }

	      createRain(drops, dropIntensity);
	    }

	}	

	// vue instance
	var todayVue = new Vue({
		el : '#today',
		data : { today : [] }
	});

	// attach to vue instance
	function attach(parsed_data) {
		todayVue.today = parsed_data;
	}

	// getting the location data
	Arbiter.subscribe('city_obtained.global', get_request);
	// getting today's forcast associated with the location
	Arbiter.subscribe('aries_data_retreaved.today', parse_request);
	// once the data has been parsed, generate the svg weather icon
	Arbiter.subscribe('weather-ready.today', get_svg);
	Arbiter.subscribe('weather-ready.today', get_clouds);
	Arbiter.subscribe('weather-ready.today', get_precipitation);
	// once the svg icon is generated, add the data to the vue instance
	Arbiter.subscribe('svg-ready.today', attach);

})();