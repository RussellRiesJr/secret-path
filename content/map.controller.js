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
      console.log('user position', userPosition);
      holdingMap = new google.maps.Map(mapDiv, {
        center: {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude},
        zoom: 9
      })
      console.log("map page data", holdingMap.data)
    }

    // Getting key from URL
    let pathName = $routeParams.pathName;
    directions = document.getElementById('directions');

    // Using key to return info from Firebase, posting initial directions
    firebase.database().ref(`/paths/${pathName}`).once("value").then(function(snapshot) {
      const startTime = snapshot.val().dateTime
      const startAddress = snapshot.val().startPoint
      const userStartLat = snapshot.val().coords.lat
      const userStartLng = snapshot.val().coords.lng
      let objStart = new Date(startTime);
      directions.innerHTML = `<h5>This path will be available by going to ${startAddress} at ${startTime}<h5>`;
      map.timeCheck(objStart);
    })

    // Creating emtry variable to hold Interval Id
    let intervalId;

    // Creating Interval for checking time
    map.setTime = function (objStart) {
      intervalId = setInterval(map.timeCheck(objStart), 300000);
      map.timeCheck(objStart);
    }

    // Checking current time against user input access time
    map.timeCheck = function (objStart) {
      let now = new Date ();
      let currentTime = now.getTime();
      let goTime = objStart - currentTime;
      // console.log('is it time', goTime);
      if(goTime <= 0) {
        clearInterval(intervalId);
        map.checkUserPosition();
      }
    }
  })
