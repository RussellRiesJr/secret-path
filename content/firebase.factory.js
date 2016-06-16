angular.module('secret')
  .factory("firebaseFactory", ($timeout) => {

    return {
      setInfo: function (secretPath) {
        firebase.database().ref('/paths').push(secretPath);
      }

    }
})
