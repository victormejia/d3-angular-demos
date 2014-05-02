'use strict';

angular.module('d3AngularDemosApp')
  .directive('barchart', function () {

    var linker = function (scope, element, attrs) {

      function handleMouseover(d, i) {
        mouseoutTimeout && clearTimeout(mouseoutTimeout);

        var tooltip = svg.select('.custom-tooltip');

        var x = xScale(d.lang);
        var y = yScale(d.value) - 35;

        // check boundaries
        if (x + tooltipWidth > width) {
          x = xScale(d.lang) - tooltipWidth + xScale.rangeBand();
        }
        var attr = { transform: 'translate(' + [x, y] + ')' };

        if (tooltip.style('visibility') === 'visible') {
          tooltip.transition().duration(300).attr(attr);
        }
        else {
          tooltip.attr(attr);
        }

        tooltip.select('text')
          .text(function () {
            return 'Repos: ' + d.value;
          });

        tooltip.style('visibility', 'visible');
      }

      function handleMouseout(d, i) {
        mouseoutTimeout = setTimeout(function () {
          svg.select('.custom-tooltip').style('visibility', 'hidden')
        }, 1000);
      }

      // setup svg element
      var el = element[0],
        margin = {top: 20, right: 10, bottom: 80, left: 45}, // margin used for axis
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
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // set up scales
      var yScale = d3.scale.linear()
        .range([height, 0]);

      var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

      // set up axis
      var xAxis = d3.svg.axis()
        .orient('bottom') // place label below tick
        .tickPadding(10); // padding b/n tick and label

      var yAxis = d3.svg.axis()
        .orient('left')
        .tickPadding(10)
        .tickFormat(d3.format('s'));

      var xAxisGroup = svg.append('g').attr({
        class : 'axis',
        transform: 'translate(' + [0, height] + ')'
      });

      var yAxisGroup = svg.append('g').attr({
        class: 'axis'
      });

      // let's create the tooltip
      var tooltip = svg.append('g').attr({class: 'custom-tooltip'}),
        tooltipWidth = 100,
        tooltipHeight = 30;
      tooltip.append('rect').attr({ height: tooltipHeight, width: tooltipWidth });
      tooltip.append('text').attr({ x: 10, y: 20 });
      var mouseoutTimeout;

      // resize chart when the width changes
      scope.$watch(function () {
        return el.clientWidth;
      }, function () {
        resize();
      });

      scope.$watch('data', function (newData, oldData) {
        if (newData !== undefined) {
          var data = angular.copy(newData);

          var maxVal = d3.max(data, function (d) { return d.value; });
          var padding = Math.round(maxVal * 0.05);
          yScale.domain([0, maxVal + padding]);
          xScale.domain(data.map(function (d) { return d.lang; }));

          // create axis
          xAxis.scale(xScale);
          yAxis.scale(yScale);

          xAxisGroup.call(xAxis)
            .selectAll('text')
              .style('text-anchor', 'end')
              .attr('dx', '-10px').attr('dy', '-11px').attr({ transform: 'rotate(-90)' });

          yAxisGroup.call(yAxis);

          //create visualization
          var r = svg.selectAll('rect.datum')
            .data(data);

          // transition new data
          r.enter()
            .insert('rect', ':first-child')
            .attr({
              x: function (d, i) {
                return xScale(d.lang)
              },
              y: height,
              height: 0,
              width: xScale.rangeBand(),
              fill: fillColor,
              class: 'datum'
            }).on('mouseover', handleMouseover).on('mouseout', handleMouseout);

          r.transition()
            .duration(1200)
            .attr({
              y: function (d, i) {
                return yScale(d.value)
              },
              height: function (d) {
                return height - yScale(d.value)
              }
            });

          // remove any data not needed
          r.exit().remove();
        }
      }, true);

      function resize() {
        // update width
        width = el.clientWidth - margin.right - margin.left;

        // update svg
        var svg = d3.select(el).select('svg')
        svg.attr('width', width + margin.left + margin.right);

        // take everything that is related to width
        xScale.rangeRoundBands([0, width], 0.1);
        xAxis.scale(xScale);
        xAxisGroup.call(xAxis)
          .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-10px')
            .attr('dy', '-11px')
            .attr({
              transform: 'rotate(-90)'
            });

        // update the bars
        svg.selectAll('rect.datum')
          .attr({
            x: function (d, i) {
              return xScale(d.lang)
            },
            width: xScale.rangeBand()
          })
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
