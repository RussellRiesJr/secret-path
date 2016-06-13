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

firebase.initializeApp({
    apiKey: "AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok",
    authDomain: "the-secret-path.firebaseapp.com",
    databaseURL: "https://the-secret-path.firebaseio.com",
    storageBucket: "the-secret-path.appspot.com",
  })

