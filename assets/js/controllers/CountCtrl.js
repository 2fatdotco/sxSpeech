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

  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.intent = angular.extend($scope.intent||{}, {

    

  });

}]);
