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
        '$scope', '$rootScope', '$interval', 'Cloud', 'uiErrorBus',
function($scope, $rootScope, $interval, Cloud, uiErrorBus) {

  // Set scope
  $scope.labels = ["Said", "Unsaid"];
  $scope.data = [0, 120];
  $scope.options = {
    segmentShowStroke: false,
    animationEasing: "easeOut",
    animateRotate : false,
    showTooltips: false
  }

  $scope.listening = false;

  // Define controller variables
  var final_transcript = '';
  var interim_transcript = '';
  $scope.finalCount = 0;
  $scope.interimCount = 0;
  $scope.totalCount = 0;

  // Watch final count,
  // hit API when it changes
  $scope.$watch('totalCount', function(currentPercent){
    Cloud.count({percent: currentPercent});
  });

  // Get secret word
  var secretWord = getUrlVars()["secret"];

  if(!secretWord){
    var secretWord = 'seagull';
  }

  // Create Web Speech API webkit recognition object
  var recognition = new webkitSpeechRecognition();

  // Set recognition object default properties
  recognition.continuous = true;
  recognition.interimResults = true;
  // Accents will be less accurate
  recognition.lang = 'en-US';

  // On recording start event
  recognition.onstart = function() {

  }

  // On result event
  // process the audio input
  recognition.onresult = function(event) {

    // If no longer $scope.listening, 
    // return without processing
    if(!$scope.listening) return;

    ////
    // Transcription
    ////

    // Interim transcript for immediate results, but not as accurate
    var interim_transcript = '';

    // Iterate through the array of results 
    // and build transcript strings
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript.toLowerCase();
        $scope.interimCount = 0;
      }
      else{
        if(event.results[i][0].confidence > 0.7){
          interim_transcript = event.results[i][0].transcript.toLowerCase();
        }
      }
    }

    // If this is a final transcription
    if(final_transcript.length > 0){
      
      // Detect the secret word
      // to reset the counter
      if(final_transcript.indexOf(secretWord) > 0){
        resetCounter();
        return;
      }

      // Populate the final count with the final string length
      $scope.finalCount = final_transcript.length;
    }

    // If there is an interim transcription
    if(interim_transcript.length > 0){
      // Populate the interim counter with the interim string length
      $scope.interimCount = interim_transcript.length;

      // Detect the secret word
      // to reset the counter
      if(final_transcript.indexOf(secretWord) > 0){
        resetCounter();
        return;
      }
    }

    // Total count is combined final & interim
    // for immediate results
    $scope.totalCount = ($scope.interimCount + $scope.finalCount);

    // Set interim transcript to scope
    $scope.interimTranscript = interim_transcript;

    if($scope.totalCount <= 140){

      var finalText = final_transcript.trim();

      if(interim_transcript && interim_transcript.indexOf(secretWord) < 0){
        var interimText = interim_transcript.trim();
        if(final_transcript){
          var interimText = ' ' + interimText;
        }
        var finalText = finalText + interim_transcript;
      }

      // Set the final transcription to scope
      $scope.finalTranscript = '<span class="quote">&ldquo;</span>' + finalText.trim() + '<span class="quote">&rdquo;</quote>';
    }

    // We never want more than 140, 
    // because that's the range of the chart
    if($scope.totalCount > 140){
      $scope.totalCount = 140;
    }

    if($scope.listening){
      $scope.$apply(function(){
        // Apply the total count
        $scope.data[0] = $scope.totalCount;
        $scope.data[1] = (140 - $scope.totalCount);
      });
    }
  }

  // On error callback
  recognition.onerror = function(event) {
    console.log("Error: ", event);
  }

  // Start recoginition object
  function startListening(event) {
    resetCounter();
    recognition.start();
    
    $scope.$apply(function(){
      $scope.listening = true;
    })
  }

  // Stop recognition object
  // and reset counter
  function stopListening(event) {
    recognition.stop();
    resetCounter();

    $scope.$apply(function(){
      $scope.listening = false;
    })
  }

  // Reset the counter
  function resetCounter(){
    
    // Reset counters
    $scope.finalCount = 0;
    $scope.interimCount = 0;
    $scope.totalCount = 0;

    // Clear the transcriptions
    $scope.interimTranscript = '';
    $scope.finalTranscript = '';

    // Apply changes to scope
    $scope.$apply(function(){
      $scope.data[0] = 0;
      $scope.data[1] = 140;
    });
  };

  // Helper function to retrieve URL params
  function getUrlVars() {
    var map = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      map[key] = value;
    });
    return map;
  }

  /**
   * HOT KEY CONTROLS
   */

  shortcut.add("Ctrl+1",function() {
    startListening();
  },{
    'type':'keydown',
    'propagate':true,
    'target':document
  });

  shortcut.add("Ctrl+2",function() {
    stopListening();
  },{
    'type':'keydown',
    'propagate':true,
    'target':document
  });

  shortcut.add("Ctrl+3",function() {
    $scope.$apply(function(){
      $scope.data[0] = 140;
      $scope.data[1] = 0;
    })
  },{
    'type':'keydown',
    'propagate':true,
    'target':document
  });

}]);
