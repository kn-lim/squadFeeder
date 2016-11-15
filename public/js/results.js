'use strict'

// google map variables
var map;

var markers;
var infoWindowContent;
var bounds;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    //initialize map
    markers = createArray(5, 3);
    infoWindowContent = createArray(5, 1);
    console.log("Finished creating arrays");

    //obtain top three
    var topthree = [];
    $(".results span").each(function() {
        topthree.push($(this).text());
    });

    //yelp search to server
    $.post("/yelprequest", {"topthree": topthree}, function(res) {
        writeResults(res);
        initialize();
    });
});

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    console.log("Created arrays");
    return arr;
};

function writeResults(res) {
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
        var res_loc_address2 = loc[i].location.address2; //might not exist
        var res_loc_country = loc[i].location.county;
        var res_loc_zip_code = loc[i].location.zip_code;
        var res_loc_city = loc[i].location.city;
        var res_loc_state = loc[i].location.state;

        var mapaddress1 = res_loc_address1.replace(/ /g,"+");
        var mapcity = res_loc_city.replace(/ /g,"+");

        var listitem = "";

        //appending rating string
        var ratingstring = " (";
        for (var j=1; j <= res_rating; j++) {
            ratingstring += "&#9733";
        }
        if (res_rating % 1 > 0) {
            ratingstring += "&#189"
        }
        ratingstring += ")"

        if(res_loc_address2) {
            var mapaddress2 = res_loc_address2.replace(/ /g,"+");

            listitem += '<div class="results-item">' +
                            '<div class="results-img">' +
                                '<img src="' + res_image_url + '">' +
                            '</div>' +
                            '<div class="results-text">' +
                                "<p><span>" + "<a href='" + res_url + "'>" + res_name + ratingstring + "</a></span></p>" +
                                "<p>" + "<a href='https://www.google.com/maps/dir/Current+Location/" +
                                mapaddress1 + "+" + mapaddress2 + "+" + mapcity + "+" + res_loc_state + "+" + res_loc_zip_code + "'>" +
                                res_loc_address1 + " " + res_loc_address2 + ", " + res_loc_city + ", " + res_loc_state + " " + res_loc_zip_code + "</p></a>"+
                            "</div>" +
                        "</div>";
        }

        else {
            listitem += '<div class="results-item">' +
                            '<div class="results-img">' +
                                '<img src="' + res_image_url + '">' +
                            '</div>' +
                            '<div class="results-text">' +
                                "<p><span>" + "<a href='" + res_url + "'>" + res_name + ratingstring + "</a></span></p>" +
                                "<p>" + "<a href='https://www.google.com/maps/dir/Current+Location/" +
                                mapaddress1 + "+" + mapcity + "+" + res_loc_state + "+" + res_loc_zip_code + "'>" +
                                res_loc_address1 + ", " + res_loc_city + ", " + res_loc_state + " " + res_loc_zip_code + "</p></a>"+
                            "</div>" +
                        "</div>";
        }

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

        // Multiple Markers
        // markers[i][0].push(res_name);
        // markers[i][1].push(rec_lat);
        // markers[i][2].push(rec_lng);

        // Info Window Content
        // infoWindowContent[i][0].push("<div class=\"info_content\">" + "<p>" + res_name + "</p>" + "</div>");

        console.log("Added to Marker and infoWindowContent array");
    }
};

function initialize() {
    console.log("Setting location to UCSD");
    var pos = {
        lng: 32.8800604,
        lat: -117.2362022
    };

    var marker;

    // Display a map on the page
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById("map_canvas"));

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers &  place each one on the map
    for( i = 0; i < 5; i++ ) {
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
