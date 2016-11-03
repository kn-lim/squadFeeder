'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("Page initialized!");
	// add any functionality and listeners you want here
}

/* Initialize map */
/*function initMap() {
    var def_loc = {lat: 32.8800649, lng: -117.2362022};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: def_loc
    });

    var marker1 = new google.maps.Marker({
        position: def_loc,
        map: map
    });

    console.log("Map initialized!");
}*/
