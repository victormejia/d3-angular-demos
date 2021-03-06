'use strict';

angular.module('d3AngularDemosApp')
  .factory('DataSvc', ['$http', '$q', function ($http, $q) {

    var DataSvc = {};

    DataSvc.getTopRepos = function () {
      return $http.get('data/github-repos-2013.json')
        .then(function (res) {
          // return d3.shuffle(res.data);
          return res.data;
        });
    };

    DataSvc.getStockData = function () {
      var deferred = $q.defer();
      var parseDate = d3.time.format("%d-%b-%y").parse;

      // let's load the csv data using d3
      d3.csv('data/aapl.csv', function (error, data) {
        data.forEach(function(d) {
          d.date = parseDate(d.date);
          d.close = +d.close;
        });

        data.sort(function(a, b) {
          return a.date - b.date;
        });

        deferred.resolve(data);
      });

      return deferred.promise;
    };

    DataSvc.getRandomPieData = function () {
      var data = d3.range(7).map(function () {
        return Math.round(Math.random() * 100);
      });
      return data;
    };

    return DataSvc;

  }]);
