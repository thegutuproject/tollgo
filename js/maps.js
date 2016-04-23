/**
 * Created by alexandrugutu on 4/23/16.
 */

var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();

var mapDiv = document.getElementById('googleMap');
function initializeMap() {
    if(navigator.geolocation) {
        var browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    }
    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("Geolocation service failed.");
            var initialLocation = newyork;
        } else {
            alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
            initialLocation = siberia;
        }
        map.setCenter(initialLocation);
    }
    
    var mapOptions = {
        center: {lat: 44.540, lng: -78.546},
        zoom: 8
    };
    var map = new google.maps.Map(mapDiv, mapOptions);

}
google.maps.event.addDomListener(window, "load", initializeMap());
