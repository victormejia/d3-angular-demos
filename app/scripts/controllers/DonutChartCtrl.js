'use strict';

angular.module('d3AngularDemosApp')
  .controller('DonutChartCtrl', ['$scope', '$window', 'DataSvc', function ($scope, $window, DataSvc) {

    // wait for window resizes
    angular.element($window).on('resize', $scope.$apply.bind($scope));

    $scope.refresh = function () {
      $scope.pieData = DataSvc.getRandomPieData();
    }

    $scope.refresh();

  }]);
