angular.module('secret')
  .factory("firebaseFactory", ($timeout) => {

    return {
      setInfo: function (secretPath) {
        return firebase.database().ref('/paths').push(secretPath).then(response => response.key)
      }

    }
})
