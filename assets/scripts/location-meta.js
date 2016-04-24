/*===========================================================
=            Location Meta, A reusable Component            =
===========================================================*/



var location_meta = (function() {

	var locationMeta = new Vue({
		el : '#location-meta', 
		data : {
			time : moment().format('h:mm a'),
			weekDay : '',
			day : '',
			city : ''
		},
		computed : {
		  weekDay : function() {
		  	return moment().format('dddd');
		  },
		  day : function() {
		    return moment().format('D');
		  }            
		}
	});

	// Updates time every 20 seconds
	window.setInterval(function() {
		locationMeta.time = moment().format('h:mm a');
	}, 20000);

	// sets the city
	function render(returned_city) {
		locationMeta.city = returned_city[0];
	}

	Arbiter.subscribe('city_obtained.global', render);

})();