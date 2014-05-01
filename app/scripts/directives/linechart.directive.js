'use strict';

angular.module('d3AngularDemosApp')
  .directive('linechart', function () {
  
  var linker = function (scope, element, attrs) {

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
    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    // set up axis
    var xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(d3.time.months, 1)
      .tickPadding(7)
      .tickFormat(d3.time.format("%b"));;

    var yAxis = d3.svg.axis()
      .orient("left");

    var xAxisGroup = svg.append('g').attr({
      class : 'axis',
      transform: 'translate(' + [0, height] + ')'
    });

    var yAxisGroup = svg.append("g")
      .attr("class", "axis");

    yAxisGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    // line
    var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });


    var mouseTarget = svg.append("rect")
      .attr({
        class: 'mousetarget',
        width: width,
        height: height,
        fill: 'none',
        'pointer-events': 'all'
      });

    // tooltip group
    var tooltip = svg.append('g').attr('class', 'linechart-tooltip').style('visibility', 'hidden'),
      tooltipWidth = 130,
      tooltipHeight = 40;
    tooltip.append('line');
    tooltip.append('circle').attr({ r: 3, class: 'inner-circle', 'pointer-events': 'none' });
    tooltip.append('circle').attr({ r: 10, class: 'outer-circle', 'pointer-events': 'none' });
    tooltip.append('rect').attr({ width: tooltipWidth, height: tooltipHeight, 'pointer-events': 'none' });

    var text = tooltip.append('text').attr('pointer-events', 'none');     

    mouseTarget.on('mousemove', showTooltip);
    svg.on('mouseleave', function () {
      tooltip.style('visibility', 'hidden')
    });

    var bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d); };

    function resize() {
      // update width
      width = el.clientWidth - margin.right - margin.left;

      // update svg
      var svg = d3.select(el).select('svg')
      svg.attr('width', width + margin.left + margin.right);

      // take everything that is related to width
      x.range([0, width]);
      xAxis.scale(x);
      xAxisGroup.call(xAxis);

      line.x(function(d) { return x(d.date); });
      var path = svg.selectAll('path.line').attr('d', line);

      if (path.node() !== null) { 
        var totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", 0);
      }
    }

    function showTooltip() {
      var coords = d3.mouse(this),
        x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(scope.data, x0, 1);
        var d0 = scope.data[i - 1],
        d1 = scope.data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      // the values
      var xPos = coords[0];
      var yPos = y(d.close);

      var tooltip = svg.select('.linechart-tooltip');

      tooltip.select("line").attr({ x1: xPos, y1: height, x2: xPos, y2: 0 });

      tooltip.select('.inner-circle').attr('cx', xPos).attr('cy', yPos)

      tooltip.select('.outer-circle').attr('cx', xPos).attr('cy', yPos)

      var tooltipPos = getTooltipPos({x: xPos, y: yPos});

      tooltip.select('rect').attr({ x: tooltipPos.x, y: tooltipPos.y});

      var text = tooltip.select('text');
      text.selectAll('tspan').remove();

      text.attr('x', tooltipPos.x + 10).attr('y', tooltipPos.y + 15);

      text.append('tspan')
        .attr('text-anchor', 'start')
        .text(function () {
          return d3.time.format('%a, %b %d %Y')(d.date);
        })
      text.append('tspan')
        .attr('dy', 16)
        .attr('dx', -96)
        .attr('text-anchor', 'start')
        .text(function () {
          return 'Price: ' + formatCurrency(d.close);
        })

      tooltip.style('visibility', 'visible');
    }

    function getTooltipPos(pos) {
      // check right boundary
      if ((pos.x + Math.round(tooltipWidth / 2)) > width) {
        return {
          x: pos.x - tooltipWidth - 20,
          y: pos.y - Math.round(tooltipHeight / 2)
        };
      }

      // check top boundary 
      if ((pos.y - tooltipHeight) < 0 ) {
        return {
          x: pos.x - Math.round(tooltipWidth / 2),
          y: pos.y + Math.round(tooltipHeight / 2)
        };
      }

      // check left boundary
      if ((pos.x - Math.round(tooltipWidth / 2)) < 0) {
        return {
          x: pos.x + 20,
          y: pos.y - Math.round(tooltipHeight / 2)
        }
      }

      return {
        x: pos.x - Math.round(tooltipWidth / 2),
        y: pos.y - tooltipHeight - 20
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

        if (newData.length == 0) {
          svg.selectAll('path').remove();
          return;
        }
        var data = angular.copy(newData);

        // scales
        x.domain([data[0].date, data[data.length - 1].date]);
        y.domain(d3.extent(data, function(d) { return d.close; }));
        
        // axis
        xAxis.scale(x);
        yAxis.scale(y);

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        //create visualization
        // use .insert instead of append so that tooltip is after
        var path = svg.insert("path", ':first-child')
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        // animate path
        // src: http://bl.ocks.org/duopixel/4063326
        var totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(700)
            .ease("linear")
            .attr("stroke-dashoffset", 0);  
      }
    }, true);           
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
