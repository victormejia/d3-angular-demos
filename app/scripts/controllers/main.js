'use strict';

angular.module('d3AngularDemosApp')
	.controller('MainCtrl', ['$scope', '$window', 'DataSvc', function ($scope, $window, DataSvc) {
		// wait for window resizes
  		angular.element($window).on('resize', $scope.$apply.bind($scope));

  		$scope.refresh = function () {
  			$scope.topRepos = [];
  			DataSvc.getTopRepos()
				.then(function (data) {
					$scope.topRepos = data;
				});
  		};

  		$scope.refresh();
	}]);
