'use strict';

angular.module('d3AngularDemosApp')
  .controller('MainCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {

      $scope.replay = function () {
        $scope.count++;
      };

      $scope.count = 1;

      $rootScope.$broadcast('tabChange', 'home');

    }
  ]);
