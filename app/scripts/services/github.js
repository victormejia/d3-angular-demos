'use strict';

angular.module('d3AngularDemosApp')
  .factory('GitHub', function ($http) {
    // Service logic
    // ...

    var getTopRepos = function () {
      return $http.get('/github-repos-2013.json')
        .then(function (res) {
          // return d3.shuffle(res.data);
          return res.data;
        });
    }

    // Public API here
    return {
      getTopRepos: getTopRepos
    };

  });
