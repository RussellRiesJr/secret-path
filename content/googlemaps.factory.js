angular.module('secret')
  .factory("googleFactory", ($http, API_URL) => {

    return {
      // Sending call to Google Maps API for directions
      getDirections(startPlus, endPlus) {
        var url = `${API_URL}origin=${startPlus}&destination=${endPlus}&key=AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok`
        console.log(url)
        return $http.get(url)
      }

    }
})
