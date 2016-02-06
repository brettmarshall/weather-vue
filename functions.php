<?php

/*===================================
=            Return URLs            =
===================================*/


// This function helps return the correct URL, helps with  /example-url vs. example-url

function envUrl() {
	$url = $_SERVER[HTTP_HOST];

	if ($url == 'nested-site') {
		$url = 'nested-site';
	} elseif ($url == 'production-site') {
		$url = 'production-site';
	} else {
		$url = 'http://' . $_SERVER[HTTP_HOST] . '/';
	}

	return $url;
}