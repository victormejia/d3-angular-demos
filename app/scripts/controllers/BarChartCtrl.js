'use strict';

angular.module('d3AngularDemosApp')
  .controller('BarChartCtrl', ['$scope', '$window', 'DataSvc', function ($scope, $window, DataSvc) {

    $scope.ui = {};

    $scope.refresh = function () {
      $scope.ui.topRepos = [];
      DataSvc.getTopRepos()
        .then(function (data) {
          $scope.ui.topRepos = data;
        });
    };

    $scope.refresh();

  }]);
