/**
 * Created by alexandrugutu on 4/23/16.
 */

var initialLocation;
var siberia = new google.maps.LatLng(40.0583, -74.4057);
var newyork = new google.maps.LatLng(40.7589, -73.9851);

var browserSupportFlag =  new Boolean();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var mapDiv = document.getElementById('googleMap');

function initializeMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    } else {
        // Browser doesn't support Geolocation
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("Geolocation service failed.");
            initialLocation = newyork;
        } else {
            alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
            initialLocation = siberia;
        }
        map.setCenter(initialLocation);
    }

    var mapOptions = {
        center: initialLocation,
        zoom: 15
    };

    var map = new google.maps.Map(mapDiv, mapOptions);
    directionsDisplay.setMap(map);


    var request = {
        origin:siberia,
        destination:newyork,
        travelMode: google.maps.TravelMode.DRIVING
    };
    console.log("prior to request");
    console.log(request);
    directionsService.route(request, function(result, status) {
        alert(status);
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);

            // new google.maps.DirectionsRenderer({
            //     map: map,
            //     directions: result
            // });
        }
    });

}

google.maps.event.addDomListener(window, "load", initializeMap());
