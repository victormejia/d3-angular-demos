'use strict';

angular.module('d3AngularDemosApp')
  .controller('LineChartCtrl', ['$scope', '$window', 'DataSvc', function ($scope, $window, DataSvc) {
    
    // wait for window resizes
    angular.element($window).on('resize', $scope.$apply.bind($scope));

    $scope.refresh = function () {
      $scope.stockData = [];
      DataSvc.getStockData()
        .then(function (data) {
          $scope.stockData = data;
        });
    };

    $scope.refresh();

  }]);
