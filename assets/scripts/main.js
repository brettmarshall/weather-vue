(function($){

  window.weatherVue = {};

  var WV = window.weatherVue;

  var $window = $(window);

  WV.init = function(){
    //WV.helpers();
    WV.additionalModernizrTests();
    WV.heroHeight();
    WV.modals();
    WV.slider();
    WV.carousel();
    WV.fancySelect();
    WV.fancyChoices();
    WV.forms();
    WV.vue();
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

    // define
    var MyComponent = Vue.extend({
      template: '<div>A custom component!</div>'
    });

    // register
    Vue.component('my-component', MyComponent);

    var vm = new Vue({
        el: '#app',
        data: {

          weather: {
              today: [],
              fiveDay: []
          },
          day: "",
          month: "",
          year: "",
          weekDay: "",
          time: "",
          city: "",
          state: ""

        },

        computed: {

        },

        methods: {

        } 

      });  

    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

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


    function onGeoError(error) {
        console.log(error);
    }           

    geolocator.locateByIP(onGeoSuccess, onGeoError, 2);

    function onGeoSuccess(location) {

      var lat = location.coords.latitude;
      var long = location.coords.longitude;
      var city = location.address.city;
      var state = location.address.region;

      vm.city = city;
      vm.state = state;

      var date = new Date();

      setInterval(function() {
        vm.time = moment().format('LTS');  
      }, 100);
      
      // Todat's forcast
      $.ajax({
         url: "http://api.aerisapi.com/forecasts/" + lat + ', ' + long + "?filter=6hr&limit=1&client_id=xeLjwzcBZlpB1FxcTvQeN&client_secret=dSL0o3LFRHpvvkXcfGloWJwcYIrGSgbwBzgPZDCU",
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

                  vm.day = timeSplit[2];
                  vm.month = month[date.getMonth()];
                  vm.year = timeSplit[3];
                  vm.weekDay = weekday[date.getDay()];

                }

                vm.weather.today = todayObj[0];

               //$('#app').html('The current weather in Seattle is ' + ob.weather.toLowerCase() + ' with a temperature of ' + ob.tempF + '°');
            }
            else {
               alert('An error occurred: ' + json.error.description);
            }
         }
      });

      // 5 Day Forcast
      $.ajax({
         url: "http://api.aerisapi.com/forecasts/" + lat + ', ' + long + "?filter=24hr&limit=5&client_id=xeLjwzcBZlpB1FxcTvQeN&client_secret=dSL0o3LFRHpvvkXcfGloWJwcYIrGSgbwBzgPZDCU",
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






$window.load(function(){

});

$(document).ready(function(){

  WV.init();

});//close document ready


})(window.jQuery);
