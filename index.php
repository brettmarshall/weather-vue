<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');
?>
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

        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <h2>{{ city }}, {{ state }}</h2>
                    <p>
                        <strong>{{ weekDay }}</strong>
                        {{ month }} {{ day }}, {{ year }}, {{ time }}
                    </p>
                    <h4>
                        <img src="/dist/images/{{ weather.today.icon }}" width="55" height="55" />
                        {{ weather.today.weather }}
                        <br>
                        <strong>{{ weather.today.tempF }}&deg; </strong>
                        <br>
                        High of {{ weather.today.maxTempF }}&deg; 
                        <br>
                        Low of {{ weather.today.minTempF }}&deg; 
                    </h4>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8 col-md-offset-2">
                    <p v-for="five in weather.fiveDay">
                        <strong>{{ five.day }}</strong>
                        <br>
                        <img src="/dist/images/{{ five.icon }}" width="55" height="55" />
                        <br>
                        {{ five.weather }}
                        <br>
                        <strong>{{ five.tempF }}&deg; </strong>
                        <br>
                        High of {{ five.maxTempF }}&deg; 
                        <br>
                        Low of {{ five.minTempF }}&deg; 
                    </p>
                </div>
            </div>            
        </div>
            
        </div>

        <?php include_once('partials/footer.php') ?>
        <?php include_once('partials/foot.php') ?>

    </body>
</html>
