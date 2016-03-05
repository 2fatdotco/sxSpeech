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
  
  $scope.$watch('totalCount', function(currentCount){
    if (currentCount){
      Cloud.count({count: currentCount});    
    }
  });

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.intent = angular.extend($scope.intent||{}, {

    

  });

}]);
