'use strict';

angular.module('d3AngularDemosApp')
  .controller('DonutChartCtrl', ['$scope', '$rootScope', 'DataSvc',
    function ($scope, $rootScope, DataSvc) {

      $scope.refresh = function () {
        $scope.pieData = DataSvc.getRandomPieData();
      }

      $scope.refresh();

      $rootScope.$broadcast('tabChange', 'donut');
    }
  ]);
