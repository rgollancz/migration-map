var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geoMercator()
    .translate([width / 2, height / 2 - 100])
    .scale((width - 1.3) / 2 / Math.PI);

var path = d3.geoPath()
        .projection(projection);

var svgWorldMap = d3.select('#world-map').append('svg')
    .attr('width', width)
    .attr('height', height * 0.5);

d3.json("./data/world-50m.json", function(error, worldMap) {
    if (error) throw error;

    var country = topojson.merge(worldMap, worldMap.objects.countries.geometries);
      // this is identifying where the array of objects which contain coordinates are in the topojson

    var g = svgWorldMap.append("g")

        g.datum(country)
      .append("path")
        .attr("d", path)
        .attr('fill', 'white')
        .attr('stroke', 'black');

  const colors = ['yellow', 'red', 'purple', 'blue', 'green', 'gray', 'pink', 'lightblue', 'lightgreen']

  d3.csv('./data/flow-of-people.csv', function(error, data) {

    for (var i = 0; i < data.length; i++) {
        var line = g.append("line")
          .attr('stroke-width', 2.5)

        var originLatitude = data[i].coordinates_origin_latitude;
        var originLongitude = data[i].coordinates_origin_longitude;

        var destinationLatitude = data[i].coordinates_destination_latitude;
        var destinationLongitude = data[i].coordinates_destination_longitude;

        var projectedOrigin = projection([originLongitude, originLatitude]);
        var projectedDestination = projection([destinationLongitude, destinationLatitude]);
        var color = colors[i];

        var dx = projectedDestination[0] - projectedOrigin[0];
        var dy = projectedDestination[1] - projectedOrigin[1];
        var arcTangent = Math.atan2(dy, dx);

        var defs = g.append('defs')
            .append('marker')
                .attr('id', 'arrow')
                  .attr('markerWidth', 10)
                  .attr('markerHeight', 10)
                  .attr('refX', 0)
                  .attr('refY', 3)
                  .attr('orient', arcTangent * (180 / Math.PI))
                  .attr('markerUnits', 'strokeWidth')
                      .append('path')
                          .attr('d', 'M0,0 L0,5 L9,3 z')
                          .attr('fill', color)
                          .attr('opacity', 0.8);


        line.attr('x1', projectedOrigin[0])
            .attr('y1', projectedOrigin[1])
            .attr('x2', projectedOrigin[0])
            .attr('y2', projectedOrigin[1])
            .attr('stroke', color)
            .attr('marker-end', 'url(#arrow)')
            .attr('opacity', 0.8).transition()
                .duration(500)
                .ease(d3.easeCubicOut)
                .delay(500 + (200 * i))
                .attr('x2', projectedDestination[0])
                .attr('y2', projectedDestination[1])
    }
  })

});
