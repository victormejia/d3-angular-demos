'use strict';

angular.module('d3AngularDemosApp')
  .controller('NavCtrl', ['$scope', function ($scope) {
    $scope.$on('tabChange', function (event, tab) {
        $scope.currentTab = tab;
    })
  }]);
