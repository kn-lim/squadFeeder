'use strict'

/* Yelp API Access Token */
//var access_token = "9SwSEoDWUYwCGDFVdI9L6T2PZ9lWa3qZu4PbE64tc3dZtlyKEzndIGjuU2O-JPxShQEB6M8ESc7RmYMCzB1M3T4uo_Ft8zFFAO3sQqObjxB-6q6Gsh07sHVAxa4bWHYx";

/* Google Map Global Variables */
var map;
var bounds;

var markers;
var infoWindowContent;

/* Position (Coordinates) of User */
var pos;

/* Call this function when the page loads (The "READY event") */
$(document).ready(function() {
    markers = createArray(5, 3);
    infoWindowContent = createArray(5, 1);
    console.log("Finished creating Markers and infoWindowContent arrays");

    var top_three = []; // Variable used to store top 3 food categories users picked
    $(".results span").each(function() {
        top_three.push($(this).text());
    });

    // var search_url ="https://api.yelp.com/v3/businesses/search?term=food&limit=5&open_now=true&sort_by=rating";
    //
    // /* Grabs categories to add to the Yelp Search URL */
    // var no_categories = false;
    //
    // if (top_three[2] == "no category") {
    //     if (top_three[1] == "no category") {
    //         if (top_three[0] == "nocategory") {
    //             // No categories
    //             no_categories = true;
    //         } else {
    //             // 1 category
    //             search_url += "&categories=" + top_three[0];
    //         }
    //     } else {
    //         // 2 categories
    //         search_url += "&categories=" + top_three[0] + "," + top_three[1];
    //     }
    // } else {
    //     // 3 categories
    //     search_url += "&categories=" + top_three[0] + "," + top_three[1] + "," + top_three[2];
    // }

    /* Grabbing User Location */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Yelp - Found User Location");
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    } else {
        console.log("Setting location to UCSD");
        pos = {
            lng: 32.8800604,
            lat: -117.2362022
        };
    }

    // /* Adds coordinates to Yelp Search URL */
    // search_url += "&latitude=32.8800604&longitude=-117.2362022";

    /* Prints Yelp Search URL */
    $.post("/yelprequest", {"topthree": topthree, "pos": pos}, function(res) {
        writeResults(res);
    });

    map_init();
});

/* Function to Create 2D Arrays */
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
};

// /* Grab access token and token type from Yelp */
// function yelp_init() {
//     console.log("Yelp - Starting Authorization");
//     $.ajax({
//         url: "https://api.yelp.com/oauth2/token",
//         method: "POST",
//         dataType: "json",
//         data: {
//             client_id: "XSB11XkGiPzzB6Oq3rJ77A",
//             client_secret: "2XtQUalVyB6z6Ety9veg5qICLMQpmobGZGz9cqrlUms8FtqIwo2h6uxOTWeoVODn",
//             grant_type: "client_credentials"
//         }
//     }).done(function(res) {
//         console.log("Yelp Authorization Successful", res);
//     });
// };
//
// /* Searches Yelp using the search_url */
// function yelp_search(searchurl) {
//     console.log("Yelp - Beginning Search");
//     $.jsonp({
//         url: searchurl,
//         corsSupport: true,
//         jsonpSupport: true,
//         beforeSend: function(xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//         },
//         success: function(res) {
//             console.log("Yelp Search Successful", res);
//             write_results(res);
//         }
//     });
// };

/* Writes Yelp Search Results to HTML */
function write_results(res) {
    $(".list-group").empty();

    var loc = res["businesses"];

    for(var i = 0; i < loc.length; i++) {
        console.log(loc[i]);

        var res = loc[i].name;
        var res_name = loc[i].name;
        var res_url = loc[i].url;
        var res_rating = loc[i].rating;
        var res_image_url = loc[i].image_url;
        var res_lng = loc[i].coordinates.longitude;
        var res_lat = loc[i].coordinates.latitude;
        var res_loc_address1 = loc[i].location.address1;
        var res_loc_address2 = loc[i].location.address2;
        var res_loc_country = loc[i].location.county;
        var res_loc_zip_code = loc[i].location.zip_code;
        var res_loc_city = loc[i].location.city;
        var res_loc_state = loc[i].location.state;

        var map_address_1 = res_loc_address1.replace(/ /g,"+");
        var map_address_2 = res_loc_address2.replace(/ /g,"+");
        var map_city = res_loc_city.replace(/ /g,"+");

        var list_item = "";

        /* Appending rating string */
        var rating_string = " (";

        for (var j = 1; j <= res_rating; j++) {
            rating_string += "&#9733";
        }

        if (res_rating % 1 > 0) {
            rating_string += "&#189";
        }

        rating_string += ")";

        list_item += '<div class="results-item">' +
                        '<div class="results-img">' +
                            '<img src="' + res_image_url + '">' +
                        '</div>' +
                        '<div class="results-text">' +
                            "<p><span>" + "<a href='" + res_url + "'>" + res_name + ratingstring + "</a></span></p>" +
                            "<p>" + "<a href='https://www.google.com/maps/dir/Current+Location/" +
                            map_address1 + "+" + map_address_2 + "+" + mapcity + "+" + res_loc_state + "+" + res_loc_zip_code + "'>" +
                            res_loc_address1 + " " + res_loc_address2 + ", " + res_loc_city + ", " + res_loc_state + " " + res_loc_zip_code + "</p></a>"+
                        "</div>" +
                    "</div>";

        $(".results-container").append(listitem);
        console.log("Appended to Restaurant List");

        // Multiple Markers
        markers[i][0] = res_name;
        console.log(markers[i][0]);
        markers[i][1] = res_lat;
        console.log(markers[i][1]);
        markers[i][2] = res_lng;
        console.log(markers[i][2]);

        // Info Window Content
        infoWindowContent[i][0] = "<div class=\"info_content\">" + "<p>" + res_name + "</p>" + "</div>";

        console.log("Added to Marker and infoWindowContent array");
    }
};

function map_init() {
    var marker;

    /* Display a map on the page */
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById("map_canvas"), {zoom: 13});

    /* Display multiple markers on a map */
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    /* Loop through our array of markers & place each one on the map */
    for( i = 0; i < 5; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });

        /* Allow each marker to have an info window */
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        /* Automatically center the map fitting all markers on the screen */
        map.fitBounds(bounds);
    }

    /* Geolocation Marker */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Google Maps - Found User Location");
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            /* Create marker on user location */
            var position = new google.maps.LatLng(pos.lat, pos.lng);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: "current location",
                icon: "https://www.robotwoods.com/dev/misc/bluecircle.png"
            });

            /* Refit bounds */
            map.fitBounds(bounds);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        /* Browser doesn't support Geolocation */
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
