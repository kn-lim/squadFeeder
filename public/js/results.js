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

jQuery(function($) {
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
    var def_zoom = {
        zoom: 7
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions, def_zoom);
    map.setTilt(45);

    // Multiple Markers
    var markers = [
        ['manna BBQ', 32.8206185,-117.1726334],
        ['Grandma\'s Tofu', 32.8205014,-117.1567012],
        ['Min Sok Chon', 32.8258868,-117.1580301],
        ['Tajima Japanese Restaurant', 32.8255461,-117.1565583],
        ['Kula Revolving Sushi Bar', 32.8245055,-117.1550359]
    ];

    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' + '<p>manna BBQ</p>' + '</div>'],
        ['<div class="info_content">' + '<p>Grandma\'s Tofu</p>' + '</div>'],
        ['<div class="info_content">' + '<p>Min Sok Chon</p>' + '</div>'],
        ['<div class="info_content">' + '<p>Tajima Japanese Restaurant</p>' + '</div>'],
        ['<div class="info_content">' + '<p>Kula Revolving Sushi Bar</p>' + '</div>']
    ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

}
