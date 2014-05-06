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
        templateUrl: 'views/Line.html',
        controller: 'LineChartCtrl'
      })
      .when('/bar', {
        templateUrl: 'views/Bar.html',
        controller: 'BarChartCtrl'
      })
      .when('/donut', {
        templateUrl: 'views/Donut.html',
        controller: 'DonutChartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
