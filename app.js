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

    svgWorldMap.append("g")
        .datum(country)
      .append("path")
        .attr("d", path);
});
