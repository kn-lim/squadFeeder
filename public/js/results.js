'use strict'
// yelp api token
var access_token = "9SwSEoDWUYwCGDFVdI9L6T2PZ9lWa3qZu4PbE64tc3dZtlyKEzndIGjuU2O-JPxShQEB6M8ESc7RmYMCzB1M3T4uo_Ft8zFFAO3sQqObjxB-6q6Gsh07sHVAxa4bWHYx";
// google map variables
var map;
var markers = [
    //['current location', pos.lat, pos.lng],
    ['manna BBQ', 32.827480, -117.157500],
    ['Grandma\'s Tofu Shop', 32.8205014,-117.1567012],
    ['Min Sok Chon', 32.8258868,-117.1580301],
    ['Tajima Japanese Restaurant', 32.8255461,-117.1565583],
    ['Kula Revolving Sushi Bar', 32.8245055,-117.1550359]
];

var infoWindowContent = [
    ['<div class="info_content">' + '<p>manna BBQ</p>' + '</div>'],
    ['<div class="info_content">' + '<p>Grandma\'s Tofu</p>' + '</div>'],
    ['<div class="info_content">' + '<p>Min Sok Chon</p>' + '</div>'],
    ['<div class="info_content">' + '<p>Tajima Japanese Restaurant</p>' + '</div>'],
    ['<div class="info_content">' + '<p>Kula Revolving Sushi Bar</p>' + '</div>']
];

var bounds;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
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

// FUNCTION FOR YELP SEARCH
function yelpSearch(searchurl) {
    console.log("Yelp - Beginning Search");
    $.jsonp({
        url: searchurl,
        corsSupport: true,
        jsonpSupport: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        },
        success: function(res) {
            console.log("Yelp Search Successful", res);
            writeResults(res);
        }
    });
};

function writeResults(res) {
    $(".list-group").empty();
    for(var i = 0; i < res.businesses.length; i++) {
        var res = res.businesses[i].name;
        var res_url = res.businesses[i].url;
        var res_image_url = res.businesses[i].image_url;
        var res_lng = res.businesses[i].coordinates.longitude;
        var res_lat = res.businesses[i].coordinates.latitude;
        var res_loc_address1 = res.business[i].location.address1;
        // // var res_loc_address2 = res.businesses[i].location.address2;
        var res_loc_country = res.businesses[i].location.county;
        var res_loc_zip_code = res.businesses[i].location.zip_code;
        var res_loc_city = res.businesses[i].location.city;
        var res_loc_state = res.businesses[i].location.state;

        var listitem = "";

        listitem += '<div class="results-item">' + 
                        '<div class="results-img">' +
                            '<img src="' + res_image_url + '">' + 
                        '</div>' +
                        '<div class="results-text>' +
                            "<p>" + "<a href='" + res_url + "'>" + res_name + "</a></p>" +
                            "<p>" + "<a href='https://www.google.com/maps/@" + res_lat + "," + res_lng + "'>" +
                            res_loc_address1 + ", " + res_loc_city + ", " + res_loc_state + " " + res_loc_zip_code + "</p></a>"+ 
                        "</div>" + 
                    "</div>";
        $(".results-container").append(listitem);

        // Multiple Markers
        // markers[i] = [];
        // markers[i][0] = res_name;
        // markers[i][1] = rec_lat;
        // markers[i][2] = rec_lng;

        // // // Info Window Content
        // infoWindowContent[i] = [];
        // infoWindowContent[i][0] = "<div class=\"info_content\">" + "<p>" + res_name + "</p>" + "</div>";
    }
}

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

    // Display a map on the page
    bounds = new google.maps.LatLngBounds()
    map = new google.maps.Map(document.getElementById("map_canvas"));

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers &  place each one on the map
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

            //create marker
            var position = new google.maps.LatLng(pos.lat, pos.lng);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: "current location",
                icon: "https://www.robotwoods.com/dev/misc/bluecircle.png"
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
}
