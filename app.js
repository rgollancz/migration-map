var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale((width - 1) / 2 / Math.PI);

var path = d3.geoPath()
        .projection(projection);

var svgWorldMap = d3.select('#world-map').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json("./data/world-50m.json", function(error, worldMap) {
    if (error) throw error;

    var country = topojson.merge(worldMap, worldMap.objects.countries.geometries);
      // this is identifying where the array of objects which contain coordinates are in the topojson

    var g = svgWorldMap.append("g")

        g.datum(country)
      .append("path")
        .attr("d", path);

  d3.csv('./data/flow-of-people.csv', function(error, data) {

    for (var i = 0; i < data.length; i++) {
        var circle = g.append("circle")
          .attr('r', 10)

        var lat = data[i].coordinates_origin_latitude;
        var long = data[i].coordinates_origin_longitude;
        circle.attr("transform", "translate(" + projection([long,lat]) + ")")
              .attr('fill', 'yellow')
        var circle = g.append("circle")
            .attr('r', 10)
        var lat = data[i].coordinates_destination_latitude;
        var long = data[i].coordinates_destination_longitude;
        circle.attr("transform", "translate(" + projection([long,lat]) + ")")
              .attr('fill', 'red')
    }
  })

});
