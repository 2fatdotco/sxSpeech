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
.controller('CountCtrl',
function($scope, $rootScope, $interval, $timeout, Cloud, uiErrorBus) {

  // Define controller variables
  var final_transcript = '';
  var interim_transcript = '';
  var forced_transcript = '';
  var confidenceThreshold = 0.7;

  // Set scope
  $scope.labels = ["Said", "Unsaid"];
  $scope.data = [0, 120];
  $scope.options = {
    segmentShowStroke: false,
    animationEasing: "easeOut",
    animateRotate : false,
    animateScale: false,
    showTooltips: false
  }

  $scope.listening = false;

  // Set count to scope
  $scope.finalCount = 0;
  $scope.interimCount = 0;
  $scope.totalCount = 0;

  // Watch total count,
  // hit API when it changes
  $scope.$watch('totalCount', function(currentCount){
    if (currentCount){
      console.log("Count: ", currentCount);
      Cloud.count({count: currentCount});    
    }
  });

  // Get secret word
  var secretWord = getUrlVars()["secret"];

  if(!secretWord){
    var secretWord = 'hibiscus';
  }

  // Create Web Speech API webkit recognition object
  var recognition = new webkitSpeechRecognition();

  // Set recognition object default properties
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  // On recording start event
  recognition.onstart = function() {
    console.log("Speech started...");
  }

  recognition.onend = function(){
    console.log("Speech stopped...");
  }

  // Recording error
  recognition.onerror = function(err) {
    console.log("Speech error: ", err);
  }

  // On result event
  // process the audio input
  recognition.onresult = function(event) {

    // If not $scope.listening, 
    // return without processing
    if(!$scope.listening) return;

    ////
    // Transcription
    ////

    // Iterate through the array of results 
    // and build transcript strings
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript.toLowerCase();

        // Received final, reset interim
        $scope.interimCount = 0;
        interim_transcript = '';
        $scope.interimTranscript = '';
      }
      else{
        if(event.results[i][0].confidence > confidenceThreshold){
          interim_transcript = event.results[i][0].transcript.toLowerCase();
        }
      }
    }

    if(forced_transcript.length > 0){
      final_transcript += forced_transcript;
    }

    // If this is a final transcription
    if(final_transcript.length > 0){

      // Populate the final count with the final string length
      $scope.finalCount = final_transcript.length;
    }

    // Else if this is an interim transcription
    if(interim_transcript.length > 0){
      // Populate the interim counter with the interim string length
      $scope.interimCount = interim_transcript.length;
    }

    // Detect the secret word
    // to reset the counter
    if(final_transcript.indexOf(secretWord) > 0){
      resetCounter();
      return;
    }

    // Total count is combined final & interim
    // for immediate results
    $scope.totalCount = ($scope.interimCount + $scope.finalCount);

    // If we're above 120, don't use interimCount
    // if($scope.totalCount > 120){
    //   $scope.totalCount = $scope.finalCount;
    // }

    // Set interim transcript to scope
    $scope.interimTranscript = interim_transcript;

    if($scope.totalCount < 140){

      var finalText = final_transcript.trim();

      if(interim_transcript && interim_transcript.indexOf(secretWord) < 0){
        var interimText = interim_transcript.trim();
        if(final_transcript){
          var interimText = ' ' + interimText;
        }
        var finalText = finalText + interim_transcript;
      }

      // Set the final transcription to scope
      $scope.finalTranscript = finalText.trim();
    }

    // We never want more than 140, 
    // because that's the range of the chart
    if($scope.totalCount >= 140){
      $scope.totalCount = 140;
      $scope.listening = false; 
    }

    $scope.$apply(function(){
      // Apply the total count
      $scope.data[0] = $scope.totalCount;
      $scope.data[1] = (140 - $scope.totalCount);
    });
  }

  // Start recoginition object
  function startListening(event) {
    console.log("Start listening...");
    //resetCounter();
    recognition.start();
    
    $scope.$apply(function(){
      $scope.listening = true;
    })
  }

  // Stop recognition object
  // and reset counter
  function stopListening(event) {
    console.log("Stop listening...");
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
    interim_transcript = '';
    final_transcript = '';

    // Apply changes to scope
    $scope.$apply(function(){
      $scope.data[0] = 0;
      $scope.data[1] = 140;
    });

    // Reset the count on API
    Cloud.count({count: -1});  
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
    
  },{
    'type':'keydown',
    'propagate':true,
    'target':document
  });

});
