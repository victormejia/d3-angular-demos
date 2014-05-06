'use strict';

angular.module('d3AngularDemosApp')
  .directive('meanVis', function () {

    var linker = function (scope, element, attrs) {
      // setup svg element
      var el = element[0],
        width = el.clientWidth,
        height = el.clientHeight,
        fillColor = '#2d323d';

      var svg = d3.select(el).append("svg").attr("width", width).attr("height", height);

      var x = d3.scale.linear().domain([0, 100]).range([0, width]);

      // browser onresize event
      // see: http://www.ng-newsletter.com/posts/d3-on-angular.html
      window.onresize = function() {
        scope.$apply(); // fire a digest cycle
      };

      var resizeTimeout;
      scope.resize = function () {
        var width = el.clientWidth;
        svg.selectAll('circle').remove().transition().duration(0);
        svg.select('line').remove();
        svg.selectAll('text').remove();

        resizeTimeout && clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function () {
          width = el.clientWidth;
          svg.selectAll('circle').remove();
          svg.attr('width', width);
          scope.render(width);
          clearTimeout(resizeTimeout);
        }, 500);
      };

      scope.render = function (width) {
        var data = d3.range(150).map(function () {
          return Math.round(Math.random() * 100);
        });

        x.range([0, width]);
        var middleY = Math.round(height/2);

        // middle axis
        var baseLine = svg.append('line')
          .attr({
            x1: 0,
            y1: middleY,
            x2: x(100),
            y2: middleY,
            fill: 'none',
            stroke: '#707070',
            'stroke-width': '2'
          });

        // title
        var title = svg.append('text')
          .attr('class', 'title')
          .attr('x', x(50))
          .attr('y', height - 20)
          .attr('text-anchor', 'middle')
          .text('Visualizing the mean (n = 0, µ = 0)');

        svg.append('text')
          .attr('x', x(1)).attr('y', middleY + 20).attr('text-anchor', 'start')
          .text('0');

        svg.append('text')
          .attr('x', x(99)).attr('y', middleY + 20).attr('text-anchor', 'end')
          .text('100');

        var pts = [];

        var points = svg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
            .attr('cx', function (d) {
              return x(d);
            })
            .attr('cy', 0)
            .attr('r', 4)
            .attr('fill', 'none');

          points.transition()
            .delay(function (d, i) {
              return i * 100;
            })
            .duration(2500)
            .ease('bounce')
            .each('start', function (d) {
              pts.push(d);
              var mean = d3.mean(pts);
              updateViz(mean, pts.length);
            })
            .attr('cx', function (d) {
              return x(d);
            })
            .attr('cy', middleY)
            .attr('fill', '#fff');

          var meanDot = svg.append('circle')
            .attr('class', 'mean-dot')
            .attr('cy', middleY)
            .attr('r', 15)
            .attr('fill', 'none');
      }

      function updateViz(mean, length) {
        svg.select('.mean-dot').transition().delay(700).ease('linear')
          .attr('cx', x(mean))
          .attr('fill', '#45A1DE');

        svg.select('.title').text('Visualizing the mean (n = ' + length + ', µ = ' + d3.format(".2f")(mean) + ')');
      }

      //resize chart when the width changes
      scope.$watch(function () {
        return el.clientWidth;
      }, function () {
        scope.resize();
      });

      scope.$watch('replayCount', function (newVal) {
        if(newVal > 1) {
          scope.resize();
        }
      });

    };

    return {
      template: '<div></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        replayCount: '='
      },
      link: linker
    };
  });
