angular.module('secret')
  .factory("googleFactory", ($http, API_URL) => {

    return {
      getDirections(startPlus, endPlus) {
        $http.get(`${API_URL}origin=${startPlus}&destination=${endPlus}&key=AIzaSyALb1dIBcyikJwzhS8u8kDKb4mAezdwNok`)
        .then(response => {console.log(response)})
      }

    }
})
