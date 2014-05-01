'use strict';

angular.module('d3AngularDemosApp')
  .directive('donutchart', function () {

    var linker = function (scope, element, attrs) {
      // setup svg element
      var el = element[0],
        margin = {top: 20, right: 20, bottom: 20, left: 20}, // margin used for axis    
        elWidth = el.clientWidth,
        elHeight = el.clientHeight,
        width = elWidth - margin.right - margin.left,
        height = elHeight - margin.top - margin.bottom,
        fillColor = '#4B7BA3';
        
      var svg = d3.select(el)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + [width/2 + margin.right, height/2 + margin.top] + ')');
      
      var radius = Math.min(width, height) / 2;

      // group of 10 colors
      var color = d3.scale.category20();

      var pie = d3.layout.pie().sort(null);

      var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * 0.6);

      function arcTween(a) {
        // see: http://bl.ocks.org/mbostock/1346410
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
        };
      }                

      // resize chart when the width changes
      scope.$watch(function () {
        return el.clientWidth;
      }, function () {
        resize();
      });

      scope.$watch('data', function (newData, oldData) {
        if (newData !== undefined) {

          var data = angular.copy(newData);

          var path = svg.selectAll('path').data(pie(data));

          // transition new data
          path.enter().append('path')
            .style('fill', function (d, i) { return color(i); })
            .each(function (d) { this._current = { startAngle: 0, endAngle: 0}; });

          // animate the data
          path.transition().duration(1000).attrTween('d', arcTween);
        }
      }, true);

      function resize() {
        // update width
      }
    };

    return {
      template: '<div></div>',
      restrict: 'E',
      replace: true,
      scope: {
        data: '='
      },
      link: linker
    };
  });
