var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

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


function getCurrentLocation(callback) {

	navigator.geolocation.getCurrentPosition(function (position) {
	    callback(position.coords.latitude + ', ' + position.coords.longitude);
	});    
}  

var pleaseBeLoc = getCurrentLocation(function(loc) {	
	pubsub.publish('location_obtained', loc);
});


// var getRequest = function() {

// 	$.ajax({
// 		url: "http://api.aerisapi.com/forecasts/" + pleaseBeLoc + "?filter=1hr&limit=1&client_id=" + creds.client_id() + "&client_secret=" + creds.client_secret(),
// 		dataType: "jsonp",
// 		success: function(json) {
// 			if (json.success === true) {
// 				return json.response;     
// 			}
// 			else {
// 				console.log(json.error.description);
// 			}
// 		}
// 	});

// };

// console.log(getRequest);

pubsub.subscribe('location_obtained', function(loc) {
	console.log('fake promise', loc);
});