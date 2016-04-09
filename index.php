<!doctype html>
<html class="no-js" lang="">
    <head>
        <title>Weather Vue</title>
        <?php include('functions.php'); ?>
        <?php include_once('partials/head.php'); ?>
    </head>
    <body class="homepage">
        <?php //include_once('partials/nav.php'); ?>
        <?php include_once('partials/header.php'); ?>
        
        <div id="app">
            
            <div class="app-top app-top--is-{{ timeOfDay }}">

                <div class="location-meta location-meta--top">
                    <p class="location-meta__location">{{ city }}</p>
                    <p class="location-meta__time">
                        <span class="location-meta__calendar">{{ day }}</span>
                        <strong>{{ weekDay }}</strong>, {{ time }}
                    </p>
                </div>              

                <div class="day-of">
                    {{ weather.today.newIcon }}
                    <h2 class="day-of__description">{{ weather.today.weather }}</h2>
                    <h1 class=class="day-of__temp">{{ weather.today.tempF }}&deg;</h1>
                </div>

            </div>

            <div class="app-bottom">

                <div class="week-wrap">
                
                    <div class="week-day" v-for="five in weather.fiveDay">
                        <p class="week-day__day">{{ five.day }}</p>
                        <img class="week-day__icon" v-bind:src="'/dist/images/weather-icons/' + five.newIcon" width="55" height="55" />
                        <p class="week-day__temp">{{ five.tempF }}&deg;</p>
                    </div>

                </div>

                <div class="location-meta">
                    <p class="location-meta__location">{{ city }}</p>
                    <p class="location-meta__time">
                        <span class="location-meta__calendar">{{ day }}</span>
                        <strong>{{ weekDay }}</strong>, {{ time }}
                    </p>
                </div>             

            </div>

            
        </div>

        <?php include_once('partials/footer.php') ?>
        <?php include_once('partials/foot.php') ?>

    </body>
</html>
