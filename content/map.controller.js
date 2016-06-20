angular.module('secret')
  .config(($routeProvider) => {
    $routeProvider
      .when('/map/:pathName', {
        controller: 'mapCtrl',
        controllerAs: 'map',
        templateUrl: 'content/map.html'
      })
    })

  .controller('mapCtrl', function($routeParams) {
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

    // Defining user access geolocation
    let accessStartLat;
    let accessStartLng;

    // Getting key from URL
    let pathName = $routeParams.pathName;
    directions = document.getElementById('directions');

    // Using key to return info from Firebase, posting initial directions
    firebase.database().ref(`/paths/${pathName}`).once("value").then(function(snapshot) {
      const startTime = snapshot.val().dateTime
      const startAddress = snapshot.val().startPoint
      accessStartLat = snapshot.val().coords.lat
      // console.log('access start lat', accessStartLat);
      accessStartLng = snapshot.val().coords.lng
      let objStart = new Date(startTime);
      directions.innerHTML = `<h5>This path will be available by going to ${startAddress} at ${startTime}<h5>`;
      map.setTimeCheck(objStart);
    })

    // Creating emty variables to hold Interval Ids for time and distance checks
    let timeIntervalId;
    let distanceIntervalId;

    // Creating unit variable
    const unit = 'M';

    // Creating Interval for checking time
    map.setTimeCheck = function (objStart) {
      timeIntervalId = setInterval(map.timeCheck(objStart), 120000);
      map.timeCheck(objStart);
    }

    // Checking current time against user input access time
    map.timeCheck = function (objStart) {
      let now = new Date ();
      let currentTime = now.getTime();
      let goTime = objStart - currentTime;
      // console.log('is it time', goTime);
      if(goTime <= 0) {
        clearInterval(timeIntervalId);
        map.getNewPostion();
      }
    }

    map.getNewPostion = function () {
      navigator.geolocation.getCurrentPosition(setDistanceCheck);
    }

    function setDistanceCheck (userPosition) {
      distanceIntervalId = setInterval(checkDistance(userPosition), 120000);
      checkDistance (userPosition)
    }

    function checkDistance (userPosition) {
      console.log('new user position?', userPosition);
      console.log('access start lat?', accessStartLat);
      let userCurrentLat = userPosition.coords.latitude;
      let userCurrentLng = userPosition.coords.longitude;
      let userDis = distance(accessStartLat, accessStartLng, userCurrentLat, userCurrentLng, unit);
      console.log("distance?", userDis);
    }

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
  })
