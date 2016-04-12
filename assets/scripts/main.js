(function($){

  window.weatherVue = {};

  var WV = window.weatherVue;

  var $window = $(window);

  WV.init = function(){
    //WV.helpers();
    WV.additionalModernizrTests();
    //WV.heroHeight();
    //WV.modals();
    //WV.slider();
    //WV.carousel();
    //WV.fancySelect();
    //WV.fancyChoices();
    //WV.forms();
    WV.vue();
    //WV.rain();
    //WV.mixing();
    // WV.skrollr();
  };


  WV.additionalModernizrTests = function() {
    Modernizr.addTest('csscalc', function() {
        var prop = 'width:';
        var value = 'calc(10px);';
        var el = document.createElement('div');

        el.style.cssText = prop + Modernizr._prefixes.join(value + prop);

        return !!el.style.length;
    });
  };

  WV.vue = function() {

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

  var client_id = getUrlParameter('id') || 'xeLjwzcBZlpB1FxcTvQeN';
  var client_secret;

  if (getUrlParameter('secret') || window.location.hostname == 'weather.brett-marshall.com') {
    client_secret = 'qPjiDGfctvbRVT0xlPpbhumYgf97VtfbylQP6sSN';
  } else {
    client_secret = 'dSL0o3LFRHpvvkXcfGloWJwcYIrGSgbwBzgPZDCU';
  }

  /* Weather Conditions */

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
  // Make it rain
  //createRain(200);  


    var vm = new Vue({
        el: '#app',
        data: {

          weather: {
              today: [
                {
                  newIcon: "",
                  day: ""
                }
              ],
              fiveDay: []
          },
          day: "",
          month: "",
          year: "",
          weekDay: "",
          time: "",
          timeOfDay: "",
          city: "",
          state: ""

        },

        computed: {

        },

        methods: {

        } 

      });  

    var weekday = new Array(7);
    weekday[0]=  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var month = new Array(11);
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    vm.weekDay = moment().format('dddd');
    vm.time = moment().format('h:mm a');
    vm.day = moment().format('D');

    setInterval(function() {
      vm.time = moment().format('h:mma');  
    }, 60000);    

    function onGeoError(error) {
        console.log(error);
    }           

    geolocator.locateByIP(onGeoSuccess, onGeoError, 'http://geoiplookup.wikimedia.org');

    function onGeoSuccess(location) {

      var lat = location.coords.latitude;
      var long = location.coords.longitude;
      var city = location.address.city;
      var state = location.address.region;

      vm.city = city;
      vm.state = state;

      var date = new Date();

      
      // Todat's forcast
      $.ajax({
         url: "http://api.aerisapi.com/forecasts/" + lat + ', ' + long + "?filter=1hr&limit=1&client_id=" + client_id + "&client_secret=" + client_secret,
         dataType: "jsonp",
         success: function(json) {
            if (json.success === true) {
               ob = json.response;

               var todayObj;

                for (var i = ob.length - 1; i >= 0; i--) {           
                  var time = new Date(ob[i].periods[0].validTime);
                  var timeString = '"' + time + '"';
                  var timeSplit = timeString.split(" ");

                  todayObj = ob[i].periods;

                  vm.month = month[date.getMonth()];
                  vm.year = timeSplit[3];

                }

                vm.weather.today = todayObj[0];
                //vm.weather.today.newIcon = todayObj[0].icon.replace('png', 'svg');
                vm.timeOfDay = todayObj[0].isDay === false ? 'night' : 'day';

                var weatherCode = todayObj[0].weatherPrimaryCoded.split(':');


                var coverage = String(weatherCode[0]),
                    intensity = String(weatherCode[1]),
                    weather = String(weatherCode[2]);

                var weatherConditions = new RegExp('[asilrwp]', 'i');
                var res = weatherConditions.test(weather);

                var drops = '';

                // if there is rain...
                if (coverage !== '' && intensity !== '' && weather !== '' && res) {
                  
                  // We have some sort of rain or snow...

                  // this gets the intensity of the rain, and adds
                  // drops and a class for more customization of the drops
                  switch (intensity) {
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
                  var windRes = windPatt.test(String(todayObj[0].weather));

                  if (windRes) {
                    $('.app-top__weather-conditions').css('transform', 'rotate(45deg');
                  }

                  createRain(drops, dropIntensity);
                }

                //console.log(weatherCode);

                

               //$('#app').html('The current weather in Seattle is ' + ob.weather.toLowerCase() + ' with a temperature of ' + ob.tempF + '°');
              $.get('/assets/images/weather-icons/' + todayObj[0].icon.replace('png', 'svg'), function(svg){
                 
                 vm.weather.today.newIcon = svg.documentElement;

                 if ($('#app').attr('data-app') == 'true') {
                  $('.day-of').prepend(vm.weather.today.newIcon);
                 }
                 
              });      
            }
            else {
               alert('An error occurred: ' + json.error.description);
            }
         }
      });


      // 5 Day Forcast
      $.ajax({
         url: "http://api.aerisapi.com/forecasts/" + lat + ', ' + long + "?filter=24hr&limit=5&client_id=" + client_id + "&client_secret=" + client_secret,
         dataType: "jsonp",
         success: function(json) {
            if (json.success === true) {
               ob = json.response;

               var days;

                for (var i = ob.length - 1; i >= 0; i--) {           
                  var time = new Date(ob[i].periods[i].validTime);
                  var timeString = '"' + time + '"';
                  var timeSplit = timeString.split(" ");

                  days = ob[0].periods;
                  //days.push(weekday[date.getDay()]);

                }

                for (var a = days.length - 1; a >= 0; a--) {           

                  //console.log(days[a]);
                  var fiveDayDate = new Date(days[a].validTime);

                  days[a].day = weekday[fiveDayDate.getDay()];

                  days[a].newIcon = days[a].icon.replace('png', 'svg');

                }                

                vm.weather.fiveDay = days;

               //$('#app').html('The current weather in Seattle is ' + ob.weather.toLowerCase() + ' with a temperature of ' + ob.tempF + '°');
            }
            else {
               alert('An error occurred: ' + json.error.description);
            }
         }
      });      

    }

    // $('.day-of').on("DOMNodeInserted", function(e){
    //   var $this = $(this);

    //   $this.addClass('loaded');
    //   $('.week-day').addClass('loaded');
    // });  

  };


  WV.fancySelect = function() {

    // Using Chosen here : http://harvesthq.github.io/chosen/

    if (!$('select').length) { return; }

    var select = $('select');

    // if there are less than ten items in the select, don't show the search feature
    select.chosen({disable_search_threshold: 10});
  };


  WV.fancyChoices = function() {

    // Using iCheck here : http://fronteed.com/iCheck/

    if (!$('input[type=radio], input[type=checkbox]').length) { return; }

    var radioNCheckboxes = $('input[type=radio], input[type=checkbox]');

    radioNCheckboxes.iCheck({
      checkboxClass: 'icheckbox_minimal',
      radioClass: 'iradio_minimal',
      increaseArea: '20%' // optional
    });
  };


  WV.forms = function(){
    
    if (!$('.gform_wrapper').length) { return; }

    $('.gfield input:not(.newsletter input), .gfield textarea').floatlabel();

    $(document).on('gform_post_render', function(event, formId, currentPage) {
      $('.gfield input:not(.newsletter input), .gfield textarea').floatlabel(); 
      WV.fancySelect(); 
      WV.fancyChoices();    
    });    

  };  


  WV.slider = function(){
    
    if (!$('.slider.owl-carousel').length) { return; }

    var looping,
        speed,
        pause,
        start,
        sliderWrap;

   sliderWrap  = $('.slider-wrap');

   // this is collecting the various options the admin has access to,
   // we're going to apply these to the slider init function below
   speed   = sliderWrap.attr('data-speed');
   // since the value returned here is either 1 or 0, its updated to either true or false to work for the slider
   looping = sliderWrap.attr('data-loop') == 1 ? true : false;
   pause   = sliderWrap.attr('data-pause');
   // since the value returned here is either 1 or 0, its updated to either true or false to work for the slider
   start   = sliderWrap.attr('data-start') == 1 ? true : false;


    $('.slider').owlCarousel({
        loop: looping,
        margin: 0,
        nav: true,
        items: 1,
        autoHeight : true,
        autoplay : start,
        autoplayHoverPause : true,
        navSpeed : speed,
        dotSpeed : speed,
        smartSpeed : speed,
        autoplaySpeed : speed,
        autoplayTimeout : pause
    });  

    // we want the speed of the transition to always be the same, so we have navSpeed, dotSpeed and smartSpeed the same
    // autoplayTimeout is how much time between slides, if they're being autoplayed

  }; 


  WV.carousel = function(){
    
    if (!$('.img-carousel.owl-carousel').length) { return; }

    var looping,
        speed,
        pause,
        start,
        carouselWrap;

   carouselWrap  = $('.carousel-wrap');

   // this is collecting the various options the admin has access to,
   // we're going to apply these to the slider init function below
   speed   = carouselWrap.attr('data-speed');
   // since the value returned here is either 1 or 0, its updated to either true or false to work for the slider
   looping = carouselWrap.attr('data-loop') == 1 ? true : false;
   pause   = carouselWrap.attr('data-pause');
   // since the value returned here is either 1 or 0, its updated to either true or false to work for the slider
   start   = carouselWrap.attr('data-start') == 1 ? true : false;


    $('.img-carousel').owlCarousel({
        loop: looping,
        margin: 0,
        nav: true,
        items: 1,
        autoplay : start,
        autoplayHoverPause : true,
        navSpeed : speed,
        dotSpeed : speed,
        smartSpeed : speed,
        autoplaySpeed : speed,
        autoplayTimeout : pause,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }        
    });  

    // we want the speed of the transition to always be the same, so we have navSpeed, dotSpeed and smartSpeed the same
    // autoplayTimeout is how much time between slides, if they're being autoplayed

  };    


  WV.heroHeight = function(){

    if (!$('.hero').length) { return; }

    // this is here to fix the 100vh bug in mobile safari.
    // basically mobile safari has a bottom status bar that isn't included in the 100vh calculation
    // this results in the 100vh being more like 100vh + 70px. the function below fixes that.
    function mobileHeaderHeight() {
      var hero = $('.hero');
      var windowHeight = window.innerHeight;

      if ($('body').width() < 769) {
        hero.css('min-height', windowHeight + 'px');
      } else {
        hero.css('min-height', '');
      }
    }

    mobileHeaderHeight();

    $(window).on('resize', mobileHeaderHeight);


  }; 


  WV.mixing = function() {

    // http://mixitup.kunkalabs.com
    if (!$('.mixing-container').length) { return; }

    $('.mixing-container').mixItUp();

  };


  WV.modals = function(){

    if (!$('.video-modal-trigger').length && !$('.general-modal-trigger').length && !$('.image-modal-trigger').length) { return; }

    var videoModal = $('.video-modal-trigger');
    var generalModal = $('.general-modal-trigger');
    var imageModal = $('.image-modal-trigger');


    videoModal.magnificPopup({
      removalDelay: 500, //delay removal by X to allow out-animation
      type: 'iframe',
      callbacks: {
        beforeOpen: function() {
           this.st.mainClass = this.st.el.attr('data-effect') || 'mfp-move-from-top';
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    }); 

    generalModal.magnificPopup({
      removalDelay: 500, //delay removal by X to allow out-animation
      callbacks: {
        beforeOpen: function() {
           this.st.mainClass = this.st.el.attr('data-effect') || 'mfp-move-from-top';
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    }); 

    imageModal.magnificPopup({
      removalDelay: 500, //delay removal by X to allow out-animation
      type: 'image',
      callbacks: {
        beforeOpen: function() {
           this.st.mainClass = this.st.el.attr('data-effect') || 'mfp-move-from-top';
        }
      },
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });               

  };    


  WV.skrollr = function(){

    var s = skrollr.init({
      mobileCheck: function() {
         //hack - forces mobile version to be off
         return false;
     }
    });

  };

  WV.reveal = function() {
    var app = $('#app');

    app.fadeIn(300);
    $('.day-of').addClass('loaded');
    $('.week-day').addClass('loaded');    
  };






$window.load(function(){
  WV.reveal();
});

$(document).ready(function(){

  WV.init();

});//close document ready


})(window.jQuery);
