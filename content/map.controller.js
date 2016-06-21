angular.module('secret')
  .config(($routeProvider) => {
    $routeProvider
      .when('/map/:key', {
        controller: 'mapCtrl',
        controllerAs: 'map',
        templateUrl: 'content/map.html'
      })
    })

  .controller('mapCtrl', function($routeParams, firebaseFactory) {
    const map = this;

    // Finding user's current position & calling default map function
    navigator.geolocation.getCurrentPosition(initMap);

    // Initilizing default Google Map
    function initMap (userPosition) {
      var mapDiv = document.getElementById('holdingMap');
      console.log('user position in init', userPosition);
      holdingMap = new google.maps.Map(mapDiv, {
        center: {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude},
        zoom: 9
      })
    }

    // Defining user access geolocation lat & lng
    let accessStartLat;
    let accessStartLng;

    // Defining delete map time
    let mapDeleteTime;

    // Defining Direction infomation
    let mapData;

    // Defining mode of travel
    let mode;

    // Defining start & end points for map
    let startAddress;
    let endAddress

    // Establishing variables for map display
    let directionsDisplay;
    let directionsService = new google.maps.DirectionsService();

    // Getting key from URL
    let pathKey = $routeParams.key;
    directions = document.getElementById('directions');
    console.log('key?', pathKey);

    // Using key to return info from Firebase, posting initial directions
    firebase.database().ref(`/paths/${pathKey}`).once("value").then(function(snapshot) {
      let startTime = snapshot.val().dateTime;
      let endTime = snapshot.val().endTime;
      startAddress = snapshot.val().startPoint;
      endAddress = snapshot.val().endPoint;
      mapData = snapshot.val().directions;
      mode = snapshot.val().mode;
      console.log('map data', mapData);
      accessStartLat = snapshot.val().coords.lat;
      accessStartLng = snapshot.val().coords.lng;
      let objStart = new Date(startTime);
      mapDeleteTime = new Date(endTime);
      directions.innerHTML = `<h5>This path will be available by going to ${startAddress} at ${startTime}<h5>`;
      map.setTimeCheck(objStart);
    })

    // Creating empty variables to hold Interval Ids for time and distance checks
    let timeIntervalId;
    let distanceIntervalId;

    // Creating miles unit variable
    const unit = 'M';

    // Creating Interval for checking time
    map.setTimeCheck = function (objStart) {
      timeIntervalId = window.setInterval(() => timeCheck(objStart), 15000);
      // map.timeCheck(objStart);
    }

    let called = false;

    // Checking current time against user input access time
    function timeCheck (objStart) {
      console.log('I ran!');
      let now = new Date ();
      let currentTime = now.getTime();
      let goTime = objStart - currentTime;
      let stopTime = mapDeleteTime - currentTime;
      // console.log('is it time', goTime);
      console.log('times up', stopTime);
      if(goTime <= 0 && called != true) {
        called = true;
        map.getNewPostion();
      }
      if(stopTime <= 0) {
        window.clearInterval(timeIntervalId);
        firebaseFactory.deletePath(pathKey)
        navigator.geolocation.getCurrentPosition(initMap);
      }
    }

    // Updating User position information
    map.getNewPostion = function () {
      navigator.geolocation.getCurrentPosition(setDistanceCheck);
    }

    // Setting interval for distance check
    function setDistanceCheck (userPosition) {
      distanceIntervalId = window.setInterval(() => checkDistance(userPosition), 15000);
      console.log("distanceIntervalId as set:", distanceIntervalId);
      // checkDistance (userPosition);
    }

    let calledDis = false;
    // Setting parameters for distance check
    function checkDistance (userPosition) {
      let userCurrentLat = userPosition.coords.latitude;
      let userCurrentLng = userPosition.coords.longitude;
      let userDis = distance(accessStartLat, accessStartLng, userCurrentLat, userCurrentLng, unit);
      console.log("distance?", userDis);
      if(userDis < 0.1 && calledDis != true) {
        calledDis = true;
        console.log("distanceIntervalId as stopped:", distanceIntervalId);
        window.clearInterval(distanceIntervalId);
        map.postMap(mapData);
      }
    }

    // Detemining distance
    function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        return dist
    }

    // Returning secret map with route once time/location objectives are met
    map.postMap = function (mapData) {
      directionsDisplay = new google.maps.DirectionsRenderer(mapData);
      var mapOptions = {
        zoom:7,
        center: {lat: mapData.routes[0].legs[0].start_location.lat, lng: mapData.routes[0].legs[0].start_location.lng},
      }
      secretMap = new google.maps.Map(document.getElementById("holdingMap"), mapOptions);
      directionsDisplay.setMap(secretMap);
      map.calcRoute();
    }

    //Calculating directions from user input
    map.calcRoute = function () {
      var start = startAddress;
      var end = endAddress;
      var request = {
        origin:start,
        destination:end,
        travelMode:mode
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });
    }

  })
