angular.module('secret')
  .factory("firebaseFactory", ($timeout) => {

    return {
      // Putting user route info into Firebase
      setInfo: function (secretPath) {
        console.log("secret path", secretPath);
        return firebase.database().ref('/paths').push(secretPath).then(response => response.key)
      },
      deletePath: function(key) {
        firebase.database().ref(`/paths/${key}`).remove();
      }
    }
})
