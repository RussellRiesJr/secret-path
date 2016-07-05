angular.module('secret', ['ngRoute'])
  .config(($routeProvider) => {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        controllerAs: 'main',
        templateUrl: 'content/main.html'
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
      let startPlus = $scope.user.starting.split(' ').join('+');
      let endPlus = $scope.user.ending.split(' ').join('+');
      let mode = $scope.user.mode;
      googleFactory.getDirections(startPlus, endPlus, mode)
        .then((response) => {main.responseData = response;
          main.initialize(response)
        })
    };

    let directionsDisplay;
    let directionsService = new google.maps.DirectionsService();

    // Initializing loading map with route based on user input
    main.initialize = function (response) {
      directionsDisplay = new google.maps.DirectionsRenderer(response);
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
      var mode = $scope.user.mode;
      console.log('mode', mode);
      var request = {
        origin:start,
        destination:end,
        travelMode: mode
      };
      directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
      });
    }

    // Setting route access date, time, location & send to Firebase, return key
    main.setPath = function () {
      let accessDateTime = $scope.user.dateTime;
      let accessEndTime = $scope.user.endTime;
      let startAddress = $scope.user.starting;
      let endAddress = $scope.user.ending;
      console.log('issue?', endAddress);
      let mode = $scope.user.mode;
      let accessLoc = {lat: main.responseData.data.routes[0].legs[0].start_location.lat, lng: main.responseData.data.routes[0].legs[0].start_location.lng};
      let hiddenRoute = main.responseData.data;
      firebaseFactory.setInfo({coords: accessLoc, dateTime: accessDateTime.toString(), endTime: accessEndTime.toString(), directions: hiddenRoute, startPoint: startAddress, endPoint: endAddress, mode: mode}).then(function(key) {
        announce.innerHTML = `<h4 class="announceBox font col-md-12">Your Secret Route has been set. It can be accessed by going to ${startAddress} on ${accessDateTime} and opening <a href="http://localhost:8080/#/map/${key}">theSecretPath.com/map/${key}</a>.<h4>`;
      })
      main.resetHome();
    }

    // Reseting home page to clear input fields and default map after info is swet
    main.resetHome = function () {
      navigator.geolocation.getCurrentPosition(initMap);
      $scope.user.starting = null;
      $scope.user.ending = null;
      $scope.user.dateTime = null;
      $scope.user.endTime = null;
      $scope.user.pathName = null;
    }

    let map = null;

    // Finding user's current position & calling default map function
    navigator.geolocation.getCurrentPosition(initMap);

    // Initilizing default Google Map
    function initMap (userPosition) {
      var mapDiv = document.getElementById('map');
      map = new google.maps.Map(mapDiv, {
        center: {lat: userPosition.coords.latitude, lng: userPosition.coords.longitude},
        zoom: 9
      })
    }

  })


firebase.initializeApp({
    apiKey: "AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok",
    authDomain: "the-secret-path.firebaseapp.com",
    databaseURL: "https://the-secret-path.firebaseio.com",
    storageBucket: "the-secret-path.appspot.com",
  })


