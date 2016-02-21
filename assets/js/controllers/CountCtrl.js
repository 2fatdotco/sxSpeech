/**
 * CountCtrl
 *
 * @type {angular.controller}
 * @module  sxspeech
 * @description  The UI controller for the character counter.
 *
 *               ## Primary responsibilities:
 *               Get and set data for character counter
 *
 */

angular.module('sxspeech')
.controller('CountCtrl', [
        '$scope', '$rootScope', 'uiErrorBus',
function($scope, $rootScope, uiErrorBus) {

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // When the controller is initially rendered
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.labels = ["Unsaid", "Said"];
  $scope.data = [140, 0];
  $scope.options = {
    segmentShowStroke: false,
    animationEasing: "easeOut",
    showTooltips: false
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.intent = angular.extend($scope.intent||{}, {

    

  });

}]);
