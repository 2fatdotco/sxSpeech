/**
 * AppCtrl
 *
 * @type {angular.controller}
 * @module  sxspeech
 * @description  The UI container for the application experience.
 *
 *               ## Primary responsibilities:
 *               Set a global scope
 *
 */

angular.module('sxspeech')
.controller('AppCtrl', [
        '$scope', '$rootScope', '$state', '$q', '$mdSidenav', '$mdTheming', '$timeout', 'uiMe', 'uiList', 'uiErrorBus',
function($scope, $rootScope, $state, $q, $mdSidenav, $mdTheming, $timeout, uiMe, uiList, uiErrorBus) {

  window.ui = {
    me: uiMe,
    theme: $mdTheming,
    state: $state
  }

  $scope.uiMe = uiMe;
  $scope.$state = $state;

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // When the application is initially rendered
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  // Make colors available to templates for SVG icons
  $scope.mdColors = {
    primary: '#607d8b',
    accent: '#ffa726'
  };

  // Create promise for app ready state
  var appReady = $q.defer();
  $rootScope.appReady = appReady.promise;

  $rootScope.appReady.then(function onReady(){
    
  })
  .catch(function onError(err){
    
  })
  .finally(function eitherWay(){
    uiMe.syncing.app = false;
  });

  appReady.resolve();

  // Fetch current user data from server
  uiMe.fetch()
  .then(function loggedIn(){

    // Do nothing

  }).catch(function notLoggedIn(err){

    $state.go('login');

  })
  .finally(function eitherWay(){

    appReady.resolve();
    
  });

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $scope.intent.closeSidenav();
    if(toState.name === 'count'){
      $scope.countActive = true;
    }
    else{
      $scope.countActive = false;
    }
  });

  $scope.intent = angular.extend($scope.intent||{}, {

    toggleSidenav: function(navTarget){
      if(navTarget === 'links'){
        $mdSidenav('links').toggle();
        $mdSidenav('account').close();
      }
      else if(navTarget === 'account'){
        $mdSidenav('account').toggle();
        $mdSidenav('links').close();
      }
    },

    closeSidenav: function(){
      $mdSidenav('links').close();
      $mdSidenav('account').close();
    }

  });

}]);
