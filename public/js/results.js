'use strict';
var access_token = "9SwSEoDWUYwCGDFVdI9L6T2PZ9lWa3qZu4PbE64tc3dZtlyKEzndIGjuU2O-JPxShQEB6M8ESc7RmYMCzB1M3T4uo_Ft8zFFAO3sQqObjxB-6q6Gsh07sHVAxa4bWHYx";

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    // yelpInit();

    var url = "https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972";
    yelpSearch(url);
});

/* Grab access token and token type from Yelp */
function yelpInit() {
    console.log("Yelp - Starting Authorization");
    $.ajax({
        url: "https://api.yelp.com/oauth2/token",
        method: "POST",
        dataType: "json",
        data: {
            client_id: "XSB11XkGiPzzB6Oq3rJ77A",
            client_secret: "2XtQUalVyB6z6Ety9veg5qICLMQpmobGZGz9cqrlUms8FtqIwo2h6uxOTWeoVODn",
            grant_type: "client_credentials"
        }
    }).done(function(res) {
        console.log("Yelp Authorization Successful", res);
    });
};

function yelpSearch(searchurl) {
    $.ajax({
        url: searchurl,
        method: "GET",
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        },
        success: function(res) {
            console.log("Yelp Search Successful", res);
        }
    });
};

// jQuery(function($) {
//     // Asynchronously Load the map API
//     var script = document.createElement('script');
//     script.src = "https://maps.googleapis.com/maps/api/js?callback=initialize&key=AIzaSyABZaEhz5AnijS8IZ8mYWYq-tQJ1dMTNxk";
//     document.body.appendChild(script);
// });

function initialize() {
    // console.log("Yelp - Finding User Location");
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         console.log("Yelp - Found User Location");
    //         var pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };
    //     });
    // } else {
    //     /* Set default position as UCSD */
    //     console.log("Cannot find user location. Setting location to UCSD");
    //     var pos = {
    //         lat: 32.8800604,
    //         lng: -117.2362022
    //     };
    // }

    console.log("Setting location to UCSD");
    var pos = {
        lat: 32.8800604,
        lng: -117.2362022
    };

    /* Authorization Tokens for Yelp */
    var token = "9SwSEoDWUYwCGDFVdI9L6T2PZ9lWa3qZu4PbE64tc3dZtlyKEzndIGjuU2O-JPxShQEB6M8ESc7RmYMCzB1M3T4uo_Ft8zFFAO3sQqObjxB-6q6Gsh07sHVAxa4bWHYx";
    var token_type = "Bearer";

    /*
     * term = restaurants: Only searches up restaurants
     * limit = 5: Returns 5 businesses
     * categories = food_category_1,food_category_2, food_category_3: Searches restaurants that falls under those 3 Categories
     * latitude, longitude: Location of where user is
     * sort_by = rating: Sorts results by ratings
     * price = price: Filters results by $
     * open_now = true: Only returns results that are currently open
     */
    console.log("Yelp - Beginning Search");
    $.ajax({
        // url: "https://api.yelp.com/v3/businesses/search?term=restaurants&limit=5&categories=" + food_category_1 + "," +  food_category_2 + "," + food_category_3 + ","
        //     + "&latitude=" + pos.lat + "&longitude=" + pos.lng + "&sort_by=" + rating + "&open_now=true",
        url: "https://api.yelp.com/v3/businesses/search?term=restaurants&limit=5" + "&latitude=" + pos.lat + "&longitude=" + pos.lng + "&sort_by=rating" + "&open_now=true",
        type: "GET",
        dataType: "json",
        headers: {"key": "Authorization", "value": window.localStorage.getItem(token_type) + " " + window.localStorage.getItem(token)},
        success: function(res) {
            console.log("Yelp - Results Found");

            /*
             * url
             * categories -> title
             * coordinates -> longitude, latitude
             * location -> country, address3, zip_code, city, address2, state, address1
             * image_url
             * name
             */

            $(".list-group").empty();
            for (i = 0; i < 5; i++) {
                var res_url = businesses[i].url;
                var res_lng = businesses[i].coordinates.longitude;
                var res_lat = businesses[i].coordinates.latitude;
                var res_loc_country = businesses[i].location.county;
                var res_loc_zip_code = businesses[i].location.zip_code;
                var res_loc_city = businesses[i].location.city;
                var res_loc_address2 = businesses[i].location.address2;
                var res_loc_state = businesses[i].location.state;
                var res_loc_address1 = business[i].location.address1;
                var res_image_url = businesses[i].image_url;
                var res_name = businesses[i].name;

                var listitem = "";

                listitem += "<div class=row><img src=\"" + res_image_url + "\"alt=" + res_name + "\">"
                    "<a href=\"" + res_url + "\">" + "<p>" + res_name + "</p></a>" +
                    "<b href=\"https://www.google.com/maps/@" + res_lat + "," + res_lng +
                    "\"<p>" + res_loc_address1 + " " + res_loc_address2 + ", " + res_loc_city + ", " + res_loc_state + " " + res_loc_zip_code + "</p></b></li>"

                listitem = '<li class="list-group-item">' + listitem;
                $(".list-group").append(listitem);
            }
        }
    });

     // show google maps
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
            console.log("Google Maps - Found User Location")
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

    // Request API access: http://www.yelp.com/developers/getting_started/api_access

    // Yelp = require('yelp');
    //
    // yelp = new Yelp({
    //     consumer_key: 'qYUWnP08Pf_KtJrIKt_Bzw',
    //     consumer_secret: 'AJ5LUL9w78Oc7bZaS2Ti3ri1Lqk',
    //     token: 'PiaLHdYCp4-8Dwb1WO0o78EuBvW9p3m9',
    //     token_secret: 'gQi4BGWZLKbeYy4WWloG8qNYcaQ',
    // });
    //
    // console.log("Yelp Authorized");
}
