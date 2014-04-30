'use strict';

angular.module('d3AngularDemosApp')
	.controller('MainCtrl', ['$scope', '$window', 'GitHub', function ($scope, $window, GitHub) {
		// wait for window resizes
  		angular.element($window).on('resize', $scope.$apply.bind($scope));

  		$scope.refresh = function () {
  			$scope.topRepos = [];
  			GitHub.getTopRepos()
				.then(function (data) {
					$scope.topRepos = data;
				});
  		};

  		$scope.refresh();
	}]);
