'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
    yelp_init();
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
    script.src = "https://maps.googleapis.com/maps/api/js?callback=initialize&key=AIzaSyABZaEhz5AnijS8IZ8mYWYq-tQJ1dMTNxk";
    document.body.appendChild(script);
});

function initialize() {
    console.log("Yelp - Beginning Search");

    console.log("Yelp - Finding User Location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition({
            console.log("Yelp - Found User Location");
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    } else {
        /* Set default position as UCSD */
        console.log("Yelp - Cannot find User Location - Setting Location to UCSD");
        var pos = {
            lat: 32.8800604
            lng: -117.2362022
        };
    }

    /*
     * term = restaurants: Only searches up restaurants
     * limit = 5: Returns 5 businesses
     * categories = food_category_1,food_category_2, food_category_3: Searches restaurants that falls under those 3 Categories
     * latitude, longitude: Location of where user is
     * sort_by = rating: Sorts results by ratings
     * price = price: Filters results by $
     * open_now = true: Only returns results that are currently open
     */
    $.ajax({
        url: "https://api.yelp.com/v3/businesses/search?term=restaurants&limit=5&categories=" + food_category_1 + "," +  food_category_2 + "," + food_category_3 + ","
            + "&latitude=" + pos.lat + "&longitude=" + pos.lng + "&sort_by=" + rating + "&open_now=true",
        data: {key: "Authorization", value: window.localStorage.getItem(token_type) + " " + window.localStorage.getItem(token)}
        },
        function(result) {
            console.log("Yelp - Results Found", result);
            // Set variables found from JSON result
            /*
             * url
             * categories -> title
             * coordinates -> longitude, latitude
             * location -> location": country, address3, zip_code, city, address2, state, address1
             * image_url
             * name
             */
        }
    )

    /* show google maps*/
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
        //['current location', pos.lat, pos.lng],
        ['manna BBQ', 32.827480, -117.157500],
        ['Grandma\'s Tofu Shop', 32.8205014,-117.1567012],
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

    //GEOLOCATION MARKER
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Google Maps - Found User Location");
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // map.setCenter(pos);

            //create marker
            var position = new google.maps.LatLng(pos.lat, pos.lng);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: "current location",
                icon: "http://www.robotwoods.com/dev/misc/bluecircle.png"
            });

            //refit bounds
            map.fitBounds(bounds);
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });

    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    // var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
    //     this.setZoom(13);
    //     google.maps.event.removeListener(boundsListener);
    // });
}

/* Grab access token and token type from Yelp */
function yelp_init() {
    console.log("Yelp - Starting Authorization");
    $.post("https://api.yelp.com/oauth2/token", {
        client_id: "XSB11XkGiPzzB6Oq3rJ77A",
        client_secret: "2XtQUalVyB6z6Ety9veg5qICLMQpmobGZGz9cqrlUms8FtqIwo2h6uxOTWeoVODn",
        grant_type: "client_credentials"
        },
        function(response) {
            console.log("Yelp Authorization Successful ", response);

            window.localStorage.setItem("token", response.access_token);
            window.localStorage.setItem("token_type", response.token_type);
        });
};
