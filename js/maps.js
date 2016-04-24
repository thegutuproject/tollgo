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
            }
        }
    }

    // for (var k = 0; k < matchedTolls.length; k++)
    // {
    //     console.log("HERE");
    //     console.log(matchedTolls[k]);
    // }

    getTollCost()
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
});

var startingExitId;
function setFirstExitID() {
    startingExitId = ourArray[0].exitid;
}

function getTollCost() {
/*
 desc:"Pembroke - Medina - NY Route 77"
 exitid:"48A"
 lat:"43.00281"
 long:"-78.41385"
 milepost:"401.72"
 route:"I-90 - NYS Thruway"
 routeid:"ML"
 type:"Interchange"
 */

    // myTollsArray

    if (matchedTolls.length == 0) {
        console.log("no tolls fucks");
    } else {
        setFirstExitID();

        var lastNumberOfTolls = matchedTolls.length;
        var lastExitID = matchedTolls[lastNumberOfTolls-1].exitid;

        if(startingExitId >= 1 && lastExitID <= 15) {
            console.log("no tolls")
        } else {
            var xAxis = changeValue(lastExitID);
            var yAxis = changeValue(startingExitId);

            console.log(xAxis);
            console.log(yAxis);

            var change = tollArray[xAxis][yAxis];
            console.log(change);
        }
    }
}


function changeValue(firstNumber) {
    var testingVar;

    if (firstNumber == "50") {
        testingVar = 41;
    } else if (firstNumber == "16") {
        testingVar = 1;
    } else if (firstNumber == "17") {
        testingVar = 2;
    } else if (firstNumber == "18") {
        testingVar = 3;
    } else if (firstNumber == "19") {
        testingVar = 4;
    } else if (firstNumber == "20") {
        testingVar = 5;
    } else if (firstNumber == "21") {
        testingVar = 6;
    } else if (firstNumber == "21B") {
        testingVar = 7;
    } else if (firstNumber == "21A") {
        testingVar = 8;
    } else if (firstNumber == "22") {
        testingVar = 9;
    } else if (firstNumber == "23") {
        testingVar = 10;
    } else if (firstNumber == "24") {
        testingVar = 11;
    } else if (firstNumber == "25") {
        testingVar = 12;
    } else if (firstNumber == "25A") {
        testingVar = 13;
    } else if (firstNumber == "26") {
        testingVar = 14;
    } else if (firstNumber == "27") {
        testingVar = 15;
    } else if (firstNumber == "28") {
        testingVar = 16;
    } else if (firstNumber == "29") {
        testingVar = 17;
    } else if (firstNumber == "29A") {
        testingVar = 18;
    } else if (firstNumber == "30") {
        testingVar = 19;
    } else if (firstNumber == "31") {
        testingVar = 20;
    } else if (firstNumber == "32") {
        testingVar = 21;
    } else if (firstNumber == "33") {
        testingVar = 22;
    } else if (firstNumber == "34") {
        testingVar = 23;
    } else if (firstNumber == "34A") {
        testingVar = 24;
    } else if (firstNumber == "35") {
        testingVar = 25;
    } else if (firstNumber == "36") {
        testingVar = 26;
    } else if (firstNumber == "37") {
        testingVar = 27;
    } else if (firstNumber == "38") {
        testingVar = 28;
    } else if (firstNumber == "39") {
        testingVar = 29;
    } else if (firstNumber == "40") {
        testingVar = 30;
    } else if (firstNumber == "41") {
        testingVar = 31;
    } else if (firstNumber == "42") {
        testingVar = 32;
    } else if (firstNumber == "43") {
        testingVar = 33;
    } else if (firstNumber == "44") {
        testingVar = 34;
    } else if (firstNumber == "45") {
        testingVar = 35;
    } else if (firstNumber == "46") {
        testingVar = 36;
    } else if (firstNumber == "47") {
        testingVar = 37;
    } else if (firstNumber == "48") {
        testingVar = 38;
    } else if (firstNumber == "48A") {
        testingVar = 39;
    } else if (firstNumber == "49") {
        testingVar = 40;
    } else {
        testingVar = 0;
    }

    return testingVar;
}

var tollArray = [
    [0, 0, 1.40, 2.15, 2.90, 3.35, 3.95, 4.45, 5.85, 6.25, 6.65, 4.95, 5.25, 5.55, 5.80, 5.55, 6.20, 6.75, 7.15, 7.70, 8.50, 8.90, 9.55, 10.05, 10.45, 10.90, 11.60, 11.70, 11.90, 11.95, 12.05, 12.20, 12.90, 13.65, 13.95, 14.60, 14.90, 15.10, 15.65, 16.40, 16.95, 17.45, 18.20, 18.35],
    [0, 0, 0, 0.20, 0.95, 1.40, 2.00, 2.50, 3.90, 4.30, 4.70, 3.00, 3.30, 3.60, 3.90, 3.60, 4.25, 4.80, 5.20, 5.72, 6.55, 7.00, 7.60, 8.10, 8.55, 8.95, 9.65, 9.75, 9.95, 10.00, 10.10, 10.25, 10.95, 11.70, 12.00, 12.65, 12.95, 13.15, 3,70, 14.45, 15.00, 15.55, 16.25, 16.40],
    [1.4,1.25,0,0.75,1.5,1.95,2.55,3.05,4.45,4.85,5.25,3.55,3.85,4.15,4.45,4.15,4.8,5.35,5.75,6.3,7.1,7.55,8.15,8.65,9.1,9.5,10.2,10.3,10.5,10.55,10.65,10.8,11.5,12.25,12.55,13.2,13.5,13.7,14.25,15,15.55,16.1,16.8,16.95],
    [2.15,1.45,0.75,0,0.75,1.2,1.8,2.3,3.7,4.1,4.5,2.8,3.1,3.4,3.7,3.4,4.1,4.6,5,5.55,6.35,6.8,7.4,7.9,8.35,8.75,9.45,9.55,9.75,9.8,9.9,10.05,10.75,11.5,11.85,12.45,12.75,12.95,13.5,14.25,14.8,15.35,16.05,16.2],
    [2.9,2.2,1.5,0.75,0,0.5,1.1,1.6,2.95,3.35,3.8,2.05,2.4,2.7,2.95,2.7,3.35,3.9,4.3,4.85,5.65,6.05,6.65,7.15,7.6,8,8.75,8.85,9.05,9.05,9.15,9.35,10.05,10.8,11.1,11.7,12.05,12.25,12.75,13.5,14.05,14.6,15.35,15.5],
    [3.35,2.65,1.95,1.2,0.5,0,0.6,1.1,2.5,2.9,3.35,1.6,1.95,2.2,2.5,2.2,2.9,3.4,3.85,4.4,5.15,5.6,6.2,6.7,7.15,7.55,8.25,8.35,8.55,8.6,8.7,8.85,9.55,10.3,10.65,11.25,11.6,11.75,12.3,13.05,13.6,14.15,14.9,15],
    [3.95,3.25,2.55,1.8,1.1,0.6,0,0.5,1.9,2.3,2.75,1,1.35,1.6,1.9,1.6,2.3,2.85,3.25,3.8,4.55,5,5.6,6.1,6.55,6.95,7.65,7.8,7.95,8,8.1,8.3,8.95,9.75,10.05,10.65,11,11.15,11.7,12.45,13,13.55,14.3,14.45],
    [4.45,3.75,3.05,2.3,1.6,1.1,0.5,0,1.4,1.8,2.25,0.5,0.85,1.1,1.4,1.1,1.8,2.35,2.75,3.3,4.05,4.5,5.1,5.6,6.05,6.45,7.15,7.3,7.45,7.5,7.6,7.8,8.45,9.25,9.55,10.15,10.5,10.65,11.2,11.95,12.5,13.05,13.8,13.95],
    [5.85,5.15,4.45,3.7,2.95,2.5,1.9,1.4,0,0.4,0.85,1.05,1.35,1.65,1.95,1.65,2.35,2.85,3.25,3.85,4.6,5.05,5.65,6.15,6.6,7,7.7,7.8,8,8.05,8.15,8.3,9,9.75,10.1,10.7,11,11.2,11.75,12.5,13.05,13.6,14.3,14.45],
    [6.25,5.55,4.85,4.1,3.35,2.9,2.3,1.8,0.4,0,0.45,1.45,1.75,2.05,2.35,2.05,2.75,3.25,3.65,4.25,5,5.45,6.05,6.55,7,7.4,8.1,8.2,8.4,8.45,8.55,8.7,9.4,10.15,10.5,11.1,11.4,11.6,12.15,12.9,13.45,14,14.7,14.85],
    [6.65,5.95,5.25,4.5,3.8,3.35,2.75,2.25,0.85,0.45,0,1.9,2.2,2.5,2.75,2.5,3.15,3.7,4.1,4.65,5.45,5.85,6.5,6.95,7.4,7.85,8.55,8.65,8.85,8.85,9,9.15,9.85,10.6,10.9,11.5,11.85,12.05,12.55,13.35,13.85,14.4,15.15,15.3],
    [4.95,4.25,3.55,2.8,2.05,1.6,1,0.5,1.05,1.45,1.9,0,0.35,0.65,0.9,0.65,1.3,1.85,2.25,2.8,3.6,4,4.65,5.1,5.55,5.95,6.7,6.8,7,7,7.1,7.3,8,8.75,9.05,9.65,10,10.2,10.7,11.45,12,12.55,13.3,13.45],
    [5.25,4.55,3.85,3.1,2.4,1.95,1.35,0.85,1.35,1.75,2.2,0.35,0,0.3,0.6,0.3,1,1.5,1.9,2.5,3.25,3.7,4.3,4.8,5.25,5.65,6.35,6.45,6.65,6.7,6.8,6.95,7.65,8.4,8.75,9.35,9.65,9.85,10.4,11.15,11.7,12.25,12.95,13.1],
    [5.55,4.85,4.15,3.4,2.7,2.2,1.6,1.1,1.65,2.05,2.5,0.65,0.3,0,0.3,0,0.7,1.25,1.65,2.2,2.95,3.4,4,4.5,4.95,5.35,6.05,6.2,6.35,6.4,6.5,6.7,7.35,8.15,8.45,9.05,9.4,9.55,10.1,10.85,11.4,11.95,12.7,12.85],
    [5.8,5.15,4.45,3.7,2.95,2.5,1.9,1.4,1.95,2.35,2.75,0.9,0.6,0.3,0,0,0.4,0.95,1.35,1.9,2.7,3.1,3.75,4.25,4.65,5.1,5.8,5.9,6.1,6.15,6.25,6.4,7.1,7.85,8.15,8.8,9.1,9.3,9.85,10.6,11.15,11.65,12.4,12.55],
    [5.55,4.85,4.15,3.4,2.7,2.2,1.6,1.1,1.65,2.05,2.5,0.65,0.3,0,0,0,0,0.55,0.95,1.5,2.3,2.75,3.35,3.85,4.3,4.7,5.4,5.5,5.7,5.75,5.85,6,6.7,7.45,7.75,8.4,8.7,8.9,9.45,10.2,10.75,11.3,12,12.15],
    [6.2,5.5,4.8,4.1,3.35,2.9,2.3,1.8,2.35,2.75,3.15,1.3,1,0.7,0.4,0,0,0.55,0.95,1.5,2.3,2.75,3.35,3.85,4.3,4.7,5.4,5.5,5.7,5.75,5.85,6,6.7,7.45,7.75,8.4,8.7,8.9,9.45,10.2,10.75,11.3,12,12.15],
    [6.75,6.05,5.35,4.6,3.9,3.4,2.85,2.35,2.85,3.25,3.7,1.85,1.5,1.25,0.95,0.55,0.55,0,0.45,1,1.75,2.2,2.8,3.3,3.75,4.15,4.85,4.95,5.15,5.2,5.3,5.45,6.15,6.9,7.25,7.85,8.2,8.35,8.9,9.65,10.2,10.75,11.5,11.6],
    [7.15,6.45,5.75,5,4.3,3.85,3.25,2.75,3.25,3.65,4.1,2.25,1.9,1.65,1.35,0.95,0.95,0.45,0,0.6,1.35,1.8,2.4,2.9,3.35,3.75,4.45,4.55,4.75,4.8,4.9,5.05,5.75,6.5,6.85,7.45,7.8,7.95,8.5,9.25,9.8,10.35,11.05,11.2],
    [7.7,7,6.3,5.55,4.85,4.4,3.8,3.3,3.85,4.25,4.65,2.8,2.5,2.2,1.9,1.5,1.5,1,0.6,0,0.8,1.25,1.85,2.35,2.8,3.2,3.9,4,4.2,4.25,4.35,4.5,5.2,5.95,6.3,6.9,7.2,7.4,7.95,8.7,9.25,9.8,10.5,10.65],
    [8.5,7.8,7.1,6.35,5.65,5.15,4.55,4.05,4.6,5,5.45,3.6,3.25,2.95,2.7,2.3,2.3,1.75,1.35,0.8,0,0.45,1.05,1.55,2,2.4,3.1,3.25,3.4,3.45,3.55,3.75,4.4,5.2,5.5,6.1,6.45,6.6,7.15,7.9,8.45,9,9.75,9.9],
    [8.9,8.25,7.55,6.8,6.05,5.6,5,4.5,5.05,5.45,5.85,4,3.7,3.4,3.1,2.75,2.75,2.2,1.8,1.25,0.45,0,0.65,1.15,1.6,2,2.7,2.8,3,3.05,3.15,3.3,4,4.75,5.05,5.7,6,6.2,6.75,7.5,8.05,8.6,9.3,9.45],
    [9.55,8.85,8.15,7.4,6.65,6.2,5.6,5.1,5.65,6.05,6.5,4.65,4.3,4,3.75,3.35,3.35,2.8,2.4,1.85,1.05,0.65,0,0.5,0.95,1.35,2.1,2.2,2.4,2.4,2.5,2.7,3.4,4.15,4.45,5.05,5.4,5.6,6.1,6.85,7.4,7.95,8.7,8.85],
    [10.05,9.35,8.65,7.9,7.15,6.7,6.1,5.6,6.15,6.55,6.95,5.1,4.8,4.5,4.25,3.85,3.85,3.3,2.9,2.35,1.55,1.15,0.5,0,0.45,0.9,1.6,1.7,1.9,1.9,2.05,2.2,2.9,3.65,3.95,4.55,4.9,5.1,5.6,6.4,6.9,7.45,8.2,8.35],
    [10.45,9.8,9.1,8.35,7.6,7.15,6.55,6.05,6.6,7,7.4,5.55,5.25,4.95,4.65,4.3,4.3,3.75,3.35,2.8,2,1.6,0.95,0.45,0,0.45,1.15,1.25,1.45,1.5,1.6,1.75,2.45,3.2,3.5,4.15,4.45,4.65,5.2,5.95,6.5,7.05,7.75,7.9],
    [10.9,10.2,9.5,8.75,8,7.55,6.95,6.45,7,7.4,7.85,5.95,5.65,5.35,5.1,4.7,4.7,4.15,3.75,3.2,2.4,2,1.35,0.9,0.45,0,0.75,0.85,1.05,1.05,1.15,1.35,2.05,2.8,3.1,3.7,4.05,4.25,4.75,5.55,6.05,6.6,7.35,7.5],
    [11.6,10.9,10.2,9.45,8.75,8.25,7.65,7.15,7.7,8.1,8.55,6.7,6.35,6.05,5.8,5.4,5.4,4.85,4.45,3.9,3.1,2.7,2.1,1.6,1.15,0.75,0,0.15,0.3,0.35,0.45,0.65,1.3,2.1,2.4,3,3.35,3.5,4.05,4.8,5.35,5.9,6.65,6.8],
    [11.7,11,10.3,9.55,8.85,8.35,7.8,7.3,7.8,8.2,8.65,6.8,6.45,6.2,5.9,5.5,5.5,4.95,4.55,4,3.25,2.8,2.2,1.7,1.25,0.85,0.15,0,0.2,0.25,0.35,0.5,1.2,1.95,2.3,2.9,3.25,3.4,3.95,4.7,5.25,5.8,6.55,6.65],
    [11.9,11.2,10.5,9.75,9.05,8.55,7.95,7.45,8,8.4,8.85,7,6.65,6.35,6.1,5.7,5.7,5.15,4.75,4.2,3.4,3,2.4,1.9,1.45,1.05,0.3,0.2,0,0.15,0.15,0.35,1,1.8,2.1,2.7,3.05,3.2,3.75,4.5,5.05,5.6,6.35,6.5],
    [11.95,11.25,10.55,9.8,9.05,8.6,8,7.5,8.05,8.45,8.85,7,6.7,6.4,6.15,5.75,5.75,5.2,4.8,4.25,3.45,3.05,2.4,1.9,1.5,1.05,0.35,0.25,0.15,0,0.15,0.3,1,1.75,2.05,2.65,3,3.2,3.7,4.5,5,5.55,6.3,6.45],
    [12.05,11.35,10.65,9.9,9.15,8.7,8.1,7.6,8.15,8.55,9,7.1,6.8,6.5,6.25,5.85,5.85,5.3,4.9,4.35,3.55,3.15,2.5,2.05,1.6,1.15,0.45,0.35,0.15,0.15,0,0.2,0.9,1.65,1.95,2.55,2.9,3.1,3.6,4.4,4.9,5.45,6.2,6.35],
    [12.2,11.5,10.8,10.05,9.35,8.85,8.3,7.8,8.3,8.7,9.15,7.3,6.95,6.7,6.4,6,6,5.45,5.05,4.5,3.75,3.3,2.7,2.2,1.75,1.35,0.65,0.5,0.35,0.3,0.2,0,0.7,1.5,1.8,2.4,2.75,2.9,3.45,4.2,4.75,5.3,6.05,6.15],
    [12.9,12.2,11.5,10.75,10.05,9.55,8.95,8.45,9,9.4,9.85,8,7.65,7.35,7.1,6.7,6.7,6.15,5.75,5.2,4.4,4,3.4,2.9,2.45,2.05,1.3,1.2,1,1,0.9,0.7,0,0.8,1.1,1.7,2.05,2.2,2.75,3.5,4.05,4.6,5.35,5.5],
    [13.65,12.95,12.25,11.5,10.8,10.3,9.75,9.25,9.75,10.15,10.6,8.75,8.4,8.15,7.85,7.45,7.45,6.9,6.5,5.95,5.2,4.75,4.15,3.65,3.2,2.8,2.1,1.95,1.8,1.75,1.65,1.5,0.8,0,0.35,0.95,1.3,1.45,2,2.75,3.3,3.85,4.6,4.7],
    [13.95,13.25,12.55,11.85,11.1,10.65,10.05,9.55,10.1,10.5,10.9,9.05,8.75,8.45,8.15,7.75,7.75,7.25,6.85,6.3,5.5,5.05,4.45,3.95,3.5,3.1,2.4,2.3,2.1,2.05,1.95,1.8,1.1,0.35,0,0.65,0.95,1.15,1.7,2.45,3,3.55,4.25,4.4],
    [14.6,13.9,13.2,12.45,11.7,11.25,10.65,10.15,10.7,11.1,11.5,9.65,9.35,9.05,8.8,8.4,8.4,7.85,7.45,6.9,6.1,5.7,5.05,4.55,4.15,3.7,3,2.9,2.7,2.65,2.55,2.4,1.7,0.95,0.65,0,0.35,0.55,1.05,1.85,2.35,2.9,3.65,3.8],
    [14.9,14.2,13.5,12.75,12.05,11.6,11,10.5,11,11.4,11.85,10,9.65,9.4,9.1,8.7,8.7,8.2,7.8,7.2,6.45,6,5.4,4.9,4.45,4.05,3.35,3.25,3.05,3,2.9,2.75,2.05,1.3,0.95,0.35,0,0.2,0.75,1.5,2.05,2.6,3.3,3.45],
    [15.1,14.4,13.7,12.95,12.25,11.75,11.15,10.65,11.2,11.6,12.05,10.2,9.85,9.55,9.3,8.9,8.9,8.35,7.95,7.4,6.6,6.2,5.6,5.1,4.65,4.25,3.5,3.4,3.2,3.2,3.1,2.9,2.2,1.45,1.15,0.55,0.2,0,0.55,1.3,1.85,2.4,3.15,3.3],
    [15.65,14.95,14.25,13.5,12.75,12.3,11.7,11.2,11.75,12.15,12.55,10.7,10.4,10.1,9.85,9.45,9.45,8.9,8.5,7.95,7.15,6.75,6.1,5.6,5.2,4.75,4.05,3.95,3.75,3.7,3.6,3.45,2.75,2,1.7,1.05,0.75,0.55,0,0.8,1.35,1.85,2.6,2.75],
    [16.4,15.7,15,14.25,13.5,13.05,12.45,11.95,12.5,12.9,13.35,11.45,11.15,10.85,10.6,10.2,10.2,9.65,9.25,8.7,7.9,7.5,6.85,6.4,5.95,5.55,4.8,4.7,4.5,4.5,4.4,4.2,3.5,2.75,2.45,1.85,1.5,1.3,0.8,0,0.55,1.1,1.85,2],
    [16.95,16.25,15.55,14.8,14.05,13.6,13,12.5,13.05,13.45,13.85,12,11.7,11.4,11.15,10.75,10.75,10.2,9.8,9.25,8.45,8.05,7.4,6.9,6.5,6.05,5.35,5.25,5.05,5,4.9,4.75,4.05,3.3,3,2.35,2.05,1.85,1.35,0.55,0,0.55,1.3,1.45],
    [17.45,16.8,16.1,15.35,14.6,14.15,13.55,13.05,13.6,14,14.4,12.55,12.25,11.95,11.65,11.3,11.3,10.75,10.35,9.8,9,8.6,7.95,7.45,7.05,6.6,5.9,5.8,5.6,5.55,5.45,5.3,4.6,3.85,3.55,2.9,2.6,2.4,1.85,1.1,0.55,0,0.75,0.9 ],
    [18.2,17.5,16.8,16.05,15.35,14.9,14.3,13.8,14.3,14.7,15.15,13.3,12.95,12.7,12.4,12,12,11.5,11.05,10.5,9.75,9.3,8.7,8.2,7.75,7.35,6.65,6.55,6.35,6.3,6.2,6.05,5.35,4.6,4.25,3.65,3.3,3.15,2.6,1.85,1.3,0.75,0,0.15],
    [18.35,17.65,16.95,16.2,15.5,15,14.45,13.95,14.45,14.85,15.3,13.45,13.1,12.85,12.55,12.15,12.15,11.6,11.2,10.65,9.9,9.45,8.85,8.35,7.9,7.5,6.8,6.65,6.5,6.45,6.35,6.15,5.5,4.7,4.4,3.8,3.45,3.3,2.75,2,1.45,0.9,0.15,0]
];