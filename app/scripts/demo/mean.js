(function () {

  var el = d3.select('#chart-mean'),
    width = parseInt(el.style('width'), 10),
    height = parseInt(el.style('height'), 10),
    fillColor = '#2d323d';

  var svg = el
    .append("svg")
      .attr("width", width)
      .attr("height", height)


  /* Create Viz
  ----------------------------------------------*/
  // var random = d3.random.normal(50, 30);
  var data;

  function replay(width) {

    data = d3.range(150).map(function () {
      // return Math.round(random());
      return Math.round(Math.random() * 100);
    });

    var x = d3.scale.linear()
      .domain([0, 100])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([0, height])
      .range([height, 0]);

    var middleY = y(height/2);

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

    var pts = [];

    var points = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr('cx', function (d) {
          return x(d);
        })
        .attr('cy', y(height))
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
          meanDot
            .transition()
            .delay(700)
            .ease('linear')
            .attr('cx', x(mean))
            .attr('fill', '#45A1DE');

          title.text('Visualizing the mean (n = ' + pts.length + ', µ = ' + d3.format(".2f")(mean) + ')');

        })
        .attr('cx', function (d) {
          return x(d);
        })
        .attr('cy', middleY)
        .attr('fill', '#fff');

    var mean = d3.mean(data);

    var meanDot = svg.append('circle')
      .attr('cx', x(mean))
      .attr('cy', middleY)
      .attr('r', 15)
      .attr('fill', 'none');

    // title
    var title = svg.append('text')
      .attr('x', x(50))
      .attr('y', y(height - 20))
      .attr('text-anchor', 'middle')
      .text('Visualizing the mean (n = 150, µ = 50)');

    svg.append('text')
      .attr('x', x(1)).attr('y', middleY + 20).attr('text-anchor', 'start')
      .text('0');

    svg.append('text')
      .attr('x', x(99)).attr('y', middleY + 20).attr('text-anchor', 'end')
      .text('100');
  }

  var timeout;
  function resizeViz() {
    svg.selectAll('circle').remove().transition().duration(0);
    svg.select('line').remove();
    svg.selectAll('text').remove();

    timeout && clearTimeout(timeout);

    timeout = setTimeout(function () {
      width = parseInt(el.style('width'), 10);
      svg.selectAll('circle').remove();
      svg.attr('width', width);
      replay(width);
      clearTimeout(timeout);
    }, 500);
  }

  window.onresize = resizeViz;
  replay(width);

  $('#chart-mean-container button').on('click', function () {
    resizeViz();
  });

})();











