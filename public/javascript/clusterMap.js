

    mapboxgl.accessToken = MapToken;
    var map = new mapboxgl.Map({
    container: 'map-box',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [78.962900, 20.593700],
    zoom: 3
    });




    // radio button to change map view
    var layerList = document.getElementById('map-radio-btn');
    var inputs = layerList.getElementsByTagName('input');

        function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
        map.on('style.load', LoadMap);
        }

        for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
        }


    // load map
    map.on('load',LoadMap) 

    function LoadMap () {

    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('destinations', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: destinations,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'destinations',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    5,
    '#f1f075',
    10,
    '#f28cb1'
    ],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
    ]
    }
    });

    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'destinations',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
    });

    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'destinations',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 6,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    var clusterId = features[0].properties.cluster_id;
    map.getSource('destinations').getClusterExpansionZoom(
    clusterId,
    function (err, zoom) {
    if (err) return;

    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom
    });
    }
    );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var {popUpMarkup} = e.features[0].properties;

    

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(popUpMarkup)
    .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
    });
    };