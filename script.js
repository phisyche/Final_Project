mapboxgl.accessToken = 'pk.eyJ1Ijoiby1ycGhldXMiLCJhIjoiY2pzN3F6YThqMGpseDQzb2ttYWJmZ2VmZCJ9.6FyHKQF5WOqnQi3mQVI2Fw'
const map = new mapboxgl.Map({
    // Settings from which we initialize the map.
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: [21.7587, 4.0383], // starting position [lng, lat]
    zoom: 1.8, // starting zoom
    // pitch: 0,
    // bearing: 0, 
     //globe projection rather than the default web mercator
    projection: 'globe',
    });


    //load the Water bodies data file from the data folder
    map.on('load', () => {
        map.addSource('water', {
            type: 'geojson',
            data: 'data/africawaterbody.geojson',
        });

        map.addLayer({
          'id': 'water-layer',
          'type': 'line',
          'source': 'water',
          'paint': {
              'line-width': 3,
              'line-color': 'blue'
          }
        });

        // load the Vegetation GeoJSON data from the data folder.
        map.addSource('vegetation', {
            type: 'geojson',
            data: 'data/veg.geojson'
        });
    
        map.addLayer({
          'id': 'vegetation-layer',
          'type': 'line',
          'source': 'vegetation',
          'paint': {
              'line-width': 3,
              'line-color': 'green',
              'line-opacity': .5
          }
        });


        // map.addSource('desert', {
        //     type: 'geojson',
        //     data: 'data/sahara.geojson'
        // });
    
        // map.addLayer({
        //   'id': 'desert-layer',
        //   'type': 'line',
        //   'source': 'bounds',
        //   'paint': {
        //       'line-width': 4,
        //       'line-color': 'brown',
        //       'line-opacity': .6
        //   }
        // });
    });

    
    map.on('load', function () {
        map.addSource('mapbox-dem', {
            "type": "raster-dem",
            "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
            'tileSize': 512,
            'maxzoom': 14
        });
        // Render the map in 3D using the setTerrain method
         map.setTerrain({"source": "mapbox-dem", "exaggeration": 1.0});

         // Add sky using the map.Setfog method.
         map.setFog({
            'range': [-1, 2],
            'horizon-blend': 0.3,
            'color': 'white',
            'high-color': '#add8e6',
            'space-color': '#d8f2ff',
            'star-intensity': 0.0
        });
         
     });
    
     
    // Add a control to adjust view at the top right corner of the page. 
    const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true
    });
    map.addControl(navControl, 'top-right');






    // /// popus

     
    // // When a click event occurs on a feature in the places layer, open a popup at the
    // // location of the feature, with description HTML from its properties.
    // map.on('click', 'trails-layer', (e) => {
    // // Copy coordinates array.
    // const coordinates = e.features[0].geometry.coordinates.slice();
    // const description = e.features[0].properties.description;
     
    // // Ensure that if the map is zoomed out such that multiple
    // // copies of the feature are visible, the popup appears
    // // over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    // coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }
     
    // new mapboxgl.Popup()
    // .setLngLat(coordinates)
    // .setHTML(description)
    // .addTo(map);
    // });
     
    // // Change the cursor to a pointer when the mouse is over the places layer.
    // map.on('mouseenter', 'trails-layer', () => {
    // map.getCanvas().style.cursor = 'pointer';
    // });
     
    // // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'places', () => {
    // map.getCanvas().style.cursor = '';
    // });


    // initialize the map
var map2 = L.map('map').setView([47.25, -122.44], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1Ijoiby1ycGhldXMiLCJhIjoiY2xhZTdqcGh1MGRybDN3bzYybHZtNnB1NyJ9.MYjEhC4VLsZGi25rlSLqgQ',
    
}).addTo(map2);


// initialize the routing plugin and add to map
var control = L.Routing.control({
    waypoints: [
        null
        // L.latLng(47.246587, -122.438830),
        // L.latLng(47.318017, -122.542970),
        // L.latLng(47.258024, -122.444725)
    ],
     routeWhileDragging: true,
     router: L.Routing.mapbox('pk.eyJ1Ijoiby1ycGhldXMiLCJhIjoiY2xhZTdqcGh1MGRybDN3bzYybHZtNnB1NyJ9.MYjEhC4VLsZGi25rlSLqgQ'),
     units:'imperial',
     collapsible: true,
     geocoder: L.Control.Geocoder.photon(),
}).addTo(map2);

// Add waypoints by clicking on the map
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

map2.on('click', function(e) {
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map2); 
    
    L.DomEvent.on(startBtn, 'click', function() {
        control.spliceWaypoints(0, 1, e.latlng);
        map2.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function() {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        control.show();
        map2.closePopup();
    });
 });

 