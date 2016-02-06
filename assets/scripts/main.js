(function($){

  window.websiteName = {};

  var WEBNAME = window.websiteName;

  var $window = $(window);

  WEBNAME.init = function(){
    WEBNAME.setElements();
    WEBNAME.additionalModernizrTests();
    WEBNAME.heroHeight();
    WEBNAME.modals();
    WEBNAME.slider();
    WEBNAME.carousel();
    WEBNAME.fancySelect();
    WEBNAME.fancyChoices();
    WEBNAME.forms();
    //WEBNAME.mixing();
    // WEBNAME.skrollr();
  };

  WEBNAME.additionalModernizrTests = function() {
    Modernizr.addTest('csscalc', function() {
        var prop = 'width:';
        var value = 'calc(10px);';
        var el = document.createElement('div');

        el.style.cssText = prop + Modernizr._prefixes.join(value + prop);

        return !!el.style.length;
    });
  };

  WEBNAME.setElements = function(){
    WEBNAME.elems             = {};

    WEBNAME.elems.href        = window.location.pathname;
    WEBNAME.elems.previousUrl = document.referrer;

  };


  WEBNAME.fancySelect = function() {

    // Using Chosen here : http://harvesthq.github.io/chosen/

    if (!$('select').length) { return; }

    var select = $('select');

    // if there are less than ten items in the select, don't show the search feature
    select.chosen({disable_search_threshold: 10});
  };


  WEBNAME.fancyChoices = function() {

    // Using iCheck here : http://fronteed.com/iCheck/

    if (!$('input[type=radio], input[type=checkbox]').length) { return; }

    var radioNCheckboxes = $('input[type=radio], input[type=checkbox]');

    radioNCheckboxes.iCheck({
      checkboxClass: 'icheckbox_minimal',
      radioClass: 'iradio_minimal',
      increaseArea: '20%' // optional
    });
  };


  WEBNAME.forms = function(){
    
    if (!$('.gform_wrapper').length) { return; }

    $('.gfield input:not(.newsletter input), .gfield textarea').floatlabel();

    $(document).on('gform_post_render', function(event, formId, currentPage) {
      $('.gfield input:not(.newsletter input), .gfield textarea').floatlabel(); 
      WEBNAME.fancySelect(); 
      WEBNAME.fancyChoices();    
    });    

  };  


  WEBNAME.slider = function(){
    
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


  WEBNAME.carousel = function(){
    
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


  WEBNAME.heroHeight = function(){

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


  WEBNAME.mixing = function() {

    // http://mixitup.kunkalabs.com
    if (!$('.mixing-container').length) { return; }

    $('.mixing-container').mixItUp();

  };


  WEBNAME.modals = function(){

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


  WEBNAME.skrollr = function(){

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

  WEBNAME.init();

});//close document ready


})(window.jQuery);
