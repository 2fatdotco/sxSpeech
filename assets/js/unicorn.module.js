/**
 * Module dependencies
 */

var dependencies = [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'ngMdIcons',
  'cloudsdk',
  'lodash'
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
.config(function($mdThemingProvider, $locationProvider) {

  $mdThemingProvider.theme('default')
  .primaryPalette('blue-grey')
  .accentPalette('orange')
  .warnPalette('red')
  .backgroundPalette('grey');

});