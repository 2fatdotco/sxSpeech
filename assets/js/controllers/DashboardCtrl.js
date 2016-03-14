/**
 * DashboardCtrl
 *
 * @type {angular.controller}
 * @module  sxspeech
 * @description  The UI controller for the dashboard.
 *
 *               ## Primary responsibilities:
 *               Display overview of data and devices.
 *
 */

angular.module('sxspeech')
.controller('DashboardCtrl', [
        '$scope', '$rootScope', 'uiErrorBus', 'uiMe', 'Cloud', '$state',
function($scope, $rootScope, uiErrorBus, uiMe, Cloud, $state) {

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // When the controller is initially rendered
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  if(!uiMe.id){
    $state.go('login');
  }

  $scope.watchTwitter = true;
  $scope.lampColor = 'white';

  $scope.props = {
    level: 10,
    pulse: 2000,
    fadeup: 2000,
    fadedown: 2000,
    setFreakLevel: 15
  };

  $scope.setProp = function(elemName){
    var msg = {};
    msg[elemName] = Number($scope.props[elemName]);
    Cloud.sendCommand(JSON.stringify(msg));
  };

  $scope.setRed = function(lev){
    Cloud.sendCommand("{\"setRed\":true}");
    $scope.lampColor = 'red';
  };

  $scope.setWhite = function(lev){
    Cloud.sendCommand("{\"setWhite\":true}");
    $scope.lampColor = 'white';
  };

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.intent = angular.extend($scope.intent||{}, {

    toggleTweets: function(isWatching){
      Cloud.toggleTweets({tweets: isWatching});
    }

  });

}]);
