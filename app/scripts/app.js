'use strict';

angular
  .module('d3AngularDemosApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/line', {
        templateUrl: 'views/linechart.html',
        controller: 'LineChartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
