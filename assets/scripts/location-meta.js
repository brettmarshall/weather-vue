/*===========================================================
=            Location Meta, A reusable Component            =
===========================================================*/



var location_meta = (function() {

	var locationMeta = new Vue({
		el : '#location-meta', 
		data : {
			time : '',
			weekDay : '',
			day : '',
			city : ''
		},
		computed : {
		  time : function() {
		    return moment().format('h:mm a');
		  },
		  weekDay : function() {
		  	return moment().format('dddd');
		  },
		  day : function() {
		    return moment().format('D');
		  }            
		}
	});

	function render(returned_city) {
		locationMeta.city = returned_city[0];
	}

	Arbiter.subscribe('city_obtained.global', render);

})();