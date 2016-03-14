angular.module('sxspeech')

// Configure UI Router
.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    /******************************
    * Configure state machine
    *******************************/

    // Cool app stuff
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .state('count', {
      url: '/count',
      templateUrl: 'templates/count.html',
      controller: 'CountCtrl'
    })
    .state('controls', {
      url: '/controls',
      templateUrl: 'templates/controls.html',
      controller: 'ControlsCtrl'
    })
    .state('positions', {
      url: '/positions',
      templateUrl: 'templates/positions.html',
      controller: 'PositionsCtrl'
    })
    // Boring account stuff
    .state('login', {
      url: '/login',
      templateUrl: 'templates/account/login.html',
      controller: 'LoginCtrl'
    })
    .state('forgot', {
      url: '/forgot',
      templateUrl: 'templates/account/forgot.html',
      controller: 'ForgotCtrl'
    })
    .state('reset', {
      url: '/reset/:authToken',
      templateUrl: 'templates/account/reset.html',
      controller: 'ResetCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/account/signup.html',
      controller: 'SignupCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/account/profile.html',
      controller: 'ProfileCtrl'
    });

    /******************************
    * Standard url routing
    *******************************/

    $urlRouterProvider

    .otherwise('/login');
  }
]);

