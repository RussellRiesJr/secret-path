angular.module('secret', ['ngRoute'])
  .config(($routeProvider) => {
    $routeProvider
      .when('/map', {
        controller: 'mapCtrl',
        controllerAs: 'map',
        templateUrl: 'content/map.html'
      })
      .otherwise('/')
  })


  // Establishing a constant for the API URL
  .constant('API_URL', 'https://maps.googleapis.com/maps/api/directions/json?' )
  // Establishing a constant for the Firebase API
  .constant('firebase_URL', 'https://the-secret-path.firebaseio.com/')

  .controller('MainCtrl', function($scope, $timeout, googleFactory, firebaseFactory) {
    const main = this;

    $scope.user = '';
    $scope.map = null;
    announce = document.getElementById('announce');
    let responseData;

    // Taking user input starting & ending points, triggering API request
    main.locations = function () {
      let startPlus = $scope.user.starting.split(' ').join('+')
      let endPlus = $scope.user.ending.split(' ').join('+')
      console.log("type startPlus =", startPlus);
      console.log("type endPlus =", endPlus);
      googleFactory.getDirections(startPlus, endPlus)
        .then((response) => {main.responseData = response;
          main.initialize(response)
        })
    };


    // Initializing loading map with route based on user input
    main.initialize = function (response) {
      directionsDisplay = new google.maps.DirectionsRenderer(response);
      console.log("map center?",response)
      var mapOptions = {
        zoom:7,
        center: {lat: response.data.routes[0].legs[0].start_location.lat, lng: response.data.routes[0].legs[0].start_location.lng},
      }
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      directionsDisplay.setMap(map);
      main.calcRoute();
    }

    //Calculating directions from user input
    main.calcRoute = function () {
      var start = $scope.user.starting;
      var end = $scope.user.ending;
      var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });
    }

    // Setting route access date, time & location
    main.setPath = function () {
      let accessDateTime = $scope.user.dateTime;
      let accessLoc = {lat: main.responseData.data.routes[0].legs[0].start_location.lat, lng: main.responseData.data.routes[0].legs[0].start_location.lng};
      let hiddenRoute = main.responseData.data;
      console.log("access date & time", accessDateTime);
      console.log("Access Coords", accessLoc);
      console.log("Route", hiddenRoute);
      announce.innerHTML = `<h4>Your Secret Route has been set. It can be accessed by going to ${$scope.user.starting} on ${accessDateTime} and opening this page.<h4>`;
    navigator.geolocation.getCurrentPosition(initMap);
    }

    let map = null;

    // Finding user's current position
    navigator.geolocation.getCurrentPosition(initMap);

    // Initilizing Google Map
    function initMap (userPosition) {
      var mapDiv = document.getElementById('map');
      console.log('user position', userPosition);
      map = new google.maps.Map(mapDiv, {
        center: {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude},
        zoom: 9
      })
      console.log("map data", map.data)
    }

    let directionsDisplay;
    let directionsService = new google.maps.DirectionsService();
  })


firebase.initializeApp({
    apiKey: "AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok",
    authDomain: "the-secret-path.firebaseapp.com",
    databaseURL: "https://the-secret-path.firebaseio.com",
    storageBucket: "the-secret-path.appspot.com",
  })


