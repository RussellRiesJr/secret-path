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

  .constant('API_URL', 'https://maps.googleapis.com/maps/api/directions/json?' )
  .constant('firebase_URL', 'https://the-secret-path.firebaseio.com/')

  .controller('MainCtrl', function($scope, $timeout, googleFactory) {
    const main = this;

    $scope.user = '';

    main.locations = function () {
      let startPlus = $scope.user.starting.split(' ').join('+')
      let endPlus = $scope.user.ending.split(' ').join('+')
      console.log("type startPlus =", startPlus);
      console.log("type endPlus =", endPlus);
      googleFactory.getDirections(startPlus, endPlus);
    };

    main.getDirections = function (startPlus, endPlus) {

    }
  })

firebase.initializeApp({
    apiKey: "AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok",
    authDomain: "the-secret-path.firebaseapp.com",
    databaseURL: "https://the-secret-path.firebaseio.com",
    storageBucket: "the-secret-path.appspot.com",
  })

