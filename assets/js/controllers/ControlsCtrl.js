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
.controller('ControlsCtrl', [
        '$scope', '$rootScope', 'uiErrorBus', 'uiMe', 'Cloud', '$state',
function($scope, $rootScope, uiErrorBus, uiMe, Cloud, $state) {

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // When the controller is initially rendered
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  if(!uiMe.id){
    $state.go('login');
  }
  
  var props = {
    level: 10,
    pulse: 2000,
    fadeup: 2000,
    fadedown: 2000,
    setFreakLevel: 15,
    toggleMood: false
  };

  var sendCommand = function(someString){
    console.log('Sending command:',someString);
    return;
  };

  $scope.setProp = function(elem){
    props[elem.id] = Number(elem.value);
    var msg = {};
    msg[elem.id] = Number(elem.value);
    sendCommand(JSON.stringify(msg));

    if (elem.id === 'setFreakLevel'){
      setTimeout(function(){
        sendCommand('{"freakout":3000}');
      },1000);
    }
  };

  var bbg = function(cid,col){
    var e = document.getElementById(cid);
    var c = e.style;
    c.backgroundColor = col;
  };

  $scope.red = function(lev){
    bbg('rb','lightblue');
    bbg('wb','white');
    sendCommand("{\"setRed\":true}");
  };

  $scope.white = function(lev){
    bbg('wb','lightblue');
    bbg('rb','white');
    sendCommand("{\"setWhite\":true}");
  };

  $scope.toggleMood = function(){
    props['toggleMood'] = !!!props['toggleMood'];
    if (props['toggleMood']){
      bbg('mood','red');
    }
    else {
      bbg('mood','white');
    }
    sendCommand("{\"toggleMood\":"+props['toggleMood']+"}");
  };



  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // DOM Events
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  $scope.intent = angular.extend($scope.intent||{}, {

  });

}]);
