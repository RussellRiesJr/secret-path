angular.module('secret')
  .config(($routeProvider) => {
    $routeProvider
      .when('/map/:pathName', {
        controller: 'mapCtrl',
        controllerAs: 'map',
        templateUrl: 'content/map.html'
      })
    })

  .controller('mapCtrl', function() {
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
  })
