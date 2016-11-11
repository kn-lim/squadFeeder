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
    topthree = [];
    $(".category").each(function() {
        topthree.push($(this).text());
    });

    var url = "https://api.yelp.com/v3/businesses/search?term=food";

    //categories
    var nocategories = false;
    if (topthree[2] == "no category") {
        if (topthree[1] == "no category") {
            if (topthree[0] == "nocategory") {
                //no categories
                nocategories = true;
            } else {      
                //1 category
                url += "&categories=" + topthree[0];
            }
        } else {
            //2 categories
            url += "&categories=" + topthree[0] + "," + topthree[1];
        }
    } else {
        //3 categories
        url += "&categories=" + topthree[0] + "," + topthree[1] + "," + topthree[2];
    }

    //location
    url += "&latitude=32.8800604&longitude=-117.2362022";
    
    if (!nocategories) {
        yelpSearch(url);
    }
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
    var loc = res["businesses"];
    for(var i = 0; i < loc.length; i++) {
        console.log(loc[i]);
        var res = loc[i].name;
        var res_name = loc[i].name;
        var res_url = loc[i].url;
        var res_image_url = loc[i].image_url;
        var res_lng = loc[i].coordinates.longitude;
        var res_lat = loc[i].coordinates.latitude;
        var res_loc_address1 = loc[i].location.address1;
        // // var res_loc_address2 = res.businesses[i].location.address2;
        var res_loc_country = loc[i].location.county;
        var res_loc_zip_code = loc[i].location.zip_code;
        var res_loc_city = loc[i].location.city;
        var res_loc_state = loc[i].location.state;

        var listitem = "";

        var mapaddress = res_loc_address1.replace(/ /g,"+");
        var mapcity = res_loc_city.replace(/ /g,"+");

        listitem += '<div class="results-item">' + 
                        '<div class="results-img">' +
                            '<img src="' + res_image_url + '">' + 
                        '</div>' +
                        '<div class="results-text">' +
                            "<p><span>" + "<a href='" + res_url + "'>" + res_name + "</a></span></p>" +
                            "<p>" + "<a href='https://www.google.com/maps/dir/Current+Location/" + 
                            mapaddress + "+" + mapcity + "+" + res_loc_state + "+" + res_loc_zip_code + "'>" +
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

    console.log("Setting location to UCSD");
    var pos = {
        lng: 32.8800604,
        lat: -117.2362022
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
