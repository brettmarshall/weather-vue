<!doctype html>
<html class="no-js" lang="">
    <head>
        <title>Weather Tab</title>
        <?php include('functions.php'); ?>
        <?php include_once('partials/head.php'); ?>
    </head>
    <body class="homepage">
        <?php include_once('partials/header.php'); ?>
        
        <div id="app-wrapper">         

            <div class="app-top" v-bind:class="today.isDay === false ? 'app-top--is-night' : 'app-top--is-day'" id="today" v-cloak>

                <span class="update-location">Update Location</span>


                <div class="day-of">
                    {{{ today.newIcon }}}
                    <h2 class="day-of__description">{{ today.weatherPrimary }}</h2>
                    <h1 class="day-of__temp">{{ today.tempF }}&deg;</h1>
                </div>   

                <div class="app-top__weather-conditions"></div>

            </div>

            <div class="app-bottom" id="five-day" v-cloak>

                <div class="week-wrap">
                
                    <div class="week-day" v-for="five in fiveDay">
                        <p class="week-day__day">{{ five.day }}</p>
                        <img class="week-day__icon" v-bind:src="'/dist/images/weather-icons/' + five.newIcon" width="55" height="55" />
                        <p class="week-day__temp">{{ five.tempF }}&deg;</p>
                    </div>            

                </div>
            
            </div>

            <div class="location-meta location-meta--top" id="location-meta" v-cloak> 
                <p class="location-meta__location">{{ city }}</p>
                <p class="location-meta__time">
                <span class="location-meta__calendar">{{ day }}</span>
                 <strong>{{ weekDay }}</strong>, {{ time }} 
                </p>
            </div>              

        </div>
       

        <?php include_once('partials/footer.php') ?>
        <?php include_once('partials/foot.php') ?>

        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-30440788-2', 'auto');
          ga('send', 'pageview');

        </script>        

    </body>
</html>
