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
            
            

                    <div class="col-md-6">
                        <ul class="icon-list-group">
                            <?php
                                $defaultIcon = glob('assets/images/weather-icons/*.png', GLOB_BRACE);

                                foreach($defaultIcon as $icon) {
                                    

                                    echo '<li><img src="' . $icon . '" height="40" width="40" /> - ' . $icon . '</li>';
                                }
                            ?>
                        </ul>

                    </div>
                    <div class="col-md-6">

                        <ul class="icon-list-group">
                            <?php
                                $svgIcons = glob('assets/images/weather-icons/*.svg', GLOB_BRACE);

                                foreach($svgIcons as $icon) {
                                    

                                    echo '<li><img src="' . $icon . '" height="40" width="40" /> - ' . $icon . '</li>';
                                }
                            ?>     
                        </ul>                   
                    </div>                    


            
        </div>

        <?php include_once('partials/footer.php') ?>
        <?php include_once('partials/foot.php') ?>

    </body>
</html>
