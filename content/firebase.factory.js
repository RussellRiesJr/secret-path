angular.module('secret')
  .factory("firebaseFactory", ($timeout) => {

    return {
      // Putting user route info into Firebase
      setInfo: function (secretPath) {
        return firebase.database().ref('/paths').push(secretPath).then(response => response.key)
      }

    }
})
