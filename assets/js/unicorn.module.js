/**
 * Module dependencies
 */

var dependencies = [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'ngMdIcons',
  'cloudsdk',
  'lodash',
  'chart.js'
];

/**
 * sxSpeech
 *
 * @class        {angular.module}
 * @module       sxspeech
 * @type         {Function}
 * @description  An angular module for a web UI.
 */

angular.module('sxspeech', dependencies)

// Config angular material design
.config(function($mdThemingProvider, $locationProvider, ChartJsProvider) {

  $mdThemingProvider.theme('default')
  .primaryPalette('blue-grey')
  .accentPalette('orange')
  .warnPalette('red')
  .backgroundPalette('grey');

  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#ff00e0', '#3b3b3b']
  });

  // Configure all doughnut charts
  // ChartJsProvider.setOptions('Doughnut', {
  //   animateScale: true
  // });

});