/**
 * Created by alexandrugutu on 4/23/16.
 */


// Toll 50 for I90
var tollLat = 42.94892;
var tollLng = -78.76393;

var initialLocation;
var siberia = new google.maps.LatLng(40.0583, -74.4057);
var newyork = new google.maps.LatLng(40.7589, -73.9851);

var browserSupportFlag =  new Boolean();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var map;
var latArray = [];
var lngArray = [];

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

    map = new google.maps.Map(mapDiv, mapOptions);
    directionsDisplay.setMap(map);

}

google.maps.event.addDomListener(window, "load", initializeMap());

document.getElementById("departure").focus();

function getDirections() {
    var start = document.getElementById("departure").value;
    var end = document.getElementById("arrival").value;
    
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            getCoordinates(result);
            // new google.maps.DirectionsRenderer({
            //     map: map,
            //     directions: result
            // });
        }
    });


}

function getCoordinates(result) {
    var currentRouteArray = result.routes[0];  //Returns a complex object containing the results of the current route
    var currentRoute = currentRouteArray.overview_path; //Returns a simplified version of all the coordinates on the path

    obj_newPolyline = new google.maps.Polyline({ map: map }); //a polyline just to verify my code is fetching the coordinates
    var path = obj_newPolyline.getPath();
    for (var x = 0; x < currentRoute.length; x++) {
        var pos = new google.maps.LatLng(currentRoute[x].lat(), currentRoute[x].lng())
        latArray[x] = currentRoute[x].lat(); //Returns the latitude
        lngArray[x] = currentRoute[x].lng(); //Returns the longitude
        // console.log(currentRoute[x].lat(), currentRoute[x].lng());
        // console.log(currentRoute[x-1].lat(), currentRoute[x-1].lng());
        // console.log("----------");
        path.push(pos);
    }

    getToll();
}

function getToll()
{
    for (var x = 1; x < latArray.length ; x++)
    {
        var lattitude1 = latArray[x];
        var longitude1 = lngArray[x];

        var lattitude2 = latArray[x-1];
        var longitude2 = lngArray[x-1];

        for (var i = 0; i < ourArray.length; i++)
        {
            if (lattitude1 < ourArray[i].lat && lattitude2 > ourArray[i].lat && longitude1 < ourArray[i].long && longitude2 > ourArray[i].long)
            {

                matchedTolls.push(ourArray[i]);

                console.log("Worked bitches");
            }
        }
    }

    for (var k = 0; k < matchedTolls.length; k++)
    {
        console.log(matchedTolls[k]);
    }
}

var InterchangeObject = function(lat, long, desc, routeid, milepost, type, exitid, route) {
    this.lat = lat;
    this.long = long;
    this.desc = desc;
    this.routeid = routeid;
    this.milepost = milepost;
    this.type = type;
    this.exitid = exitid;
    this.route = route;

    console.log("object created");
}

var ourArray = [];
var matchedTolls = [];

$.getJSON("./toll.json", function(json) {
    for(var i = 0; i < json.interchange.interchanges.length; i++) {
        var latitudeReturned = json.interchange.interchanges[i].latitude;
        var longitudeReturned = json.interchange.interchanges[i].longitude;
        var descriptionReturned = json.interchange.interchanges[i].description;
        var routeIdReturned = json.interchange.interchanges[i].routeid;
        var milepostReturned = json.interchange.interchanges[i].milepost;
        var typeReturned = json.interchange.interchanges[i].type;
        var exitIdReturned = json.interchange.interchanges[i].exitid;
        var routeReturned = json.interchange.interchanges[i].route;

        var newInterchange = new InterchangeObject(latitudeReturned, longitudeReturned, descriptionReturned, routeIdReturned, milepostReturned, typeReturned, exitIdReturned, routeReturned);
        ourArray.push(newInterchange);
    }

    console.log(ourArray.length);
});