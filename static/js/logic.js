

// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var map = L.map('map', {
    center: [
        51.505, -0.09],
        minZoom: 2,
        maxZoom: 50
});

var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution
}).addTo(map);

map.setView([0, 0], 0);
  // Adding tile layer

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {	
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  //id: "mapbox.streets",
  id: "mapbox/streets-v11", 
  accessToken: API_KEY
//   "pk.eyJ1IjoibXRyaWFzIiwiYSI6ImNrYmJraTN1bjAxZ2kycW9kd2dnaXpyM2kifQ.31yjXdHCxZaNz4bvI-Qsrg"
}).addTo(map);

//link to data
var link= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// var earthMarker= [];
d3.json(link,function (data) {
 
    console.log(data)

    function mapStyle(feature){
        return{
            color:"black",
            fillColor: getColor(feature.properties.mag), 
            opacity: 1,
            fillOpacity:1,
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5,

        };
    }
// change color based on magnitude size
    function getColor (magnitude){
        switch (true){
        case magnitude >6:
            return "#581845"
        case magnitude >5:
            return "#900C3F"
        case magnitude >4:
            return "#C70039"
        case magnitude >3:
            return "#FF5733"
        case magnitude >2:
            return "#FFC300"
        case magnitude >1:
            return "#DAF7A6"
        
        }
    }
    
    function getRadius(magnitude){
        if (magnitude ===0) {
            return 1;
        }

        return magnitude * 4;
    }
// bind data and display per marker
    L.geoJson(data,{
        pointToLayer: function(geature, latlng){
            return L.circleMarker(latlng);
        },
        style: mapStyle,

        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag  + "<br>" +"Location:" + feature.properties.place)
        }
    }).addTo(map);

//create a legend and display corresponding colors next to magnitude size
    var legend = L.control({position: 'bottomleft'});
        legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Categories</strong>'],
        categories = ['Magnitude: 0-1','Magnitude: 1-2','Magnitude: 2-3','Magnitude: 3-4','Magnitude: 4-5','Magnitude: 5+']

    for (var i = 0; i < categories.length; i++) {

        div.innerHTML += 
        labels.push(
            '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] : '+'));

    }
        div.innerHTML = labels.join('<br>');
        return div;
    };
        legend.addTo(map);

});
