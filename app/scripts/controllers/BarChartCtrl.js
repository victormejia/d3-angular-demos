'use strict';

angular.module('d3AngularDemosApp')
  .controller('BarChartCtrl', ['$scope', '$rootScope', '$window', 'DataSvc', function ($scope, $rootScope, $window, DataSvc) {

    $scope.ui = {};

    $scope.refresh = function () {
      $scope.ui.topRepos = [];
      DataSvc.getTopRepos()
        .then(function (data) {
          $scope.ui.topRepos = data;
        });
    };

    $scope.refresh();

    $rootScope.$broadcast('tabChange', 'bar');

  }]);
