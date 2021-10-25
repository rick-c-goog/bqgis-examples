import mapboxgl from 'mapbox-gl';
import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, PolygonLayer} from '@deck.gl/layers';
import {
  CartoLayer,
  setDefaultCredentials,
  BASEMAP,
  colorBins,
  API_VERSIONS,
  MAP_TYPES
} from '@deck.gl/carto';
  
  
//start of bq query
 //const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
 //const GOOGLE_MAP_ID = process.env.GoogleMapsMapId; // eslint-disable-line
 //const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/bigquery';
  const project_id='rick-chen-demo1';
  const queryString= "select  ST_ASGEOJSON(station_geom) as geom, station_id, station_name, borough_name, daytime_routes from bigquery-public-data.new_york_subway.stations";   
  var client_id='99330940923-88hbc1aktvke92ckjn30d4mtl0egnr0u.apps.googleusercontent.com';
  var bqrows;
  var geoJsonData = [];
  var geoFeatureCollection;
  var config = {
    'client_id': client_id,
    'scope': SCOPE
  };
  function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init(config).then(function() {
      // 3. Initialize and make the API request.
      return gapi.client.request({
        'path': `https://www.googleapis.com/bigquery/v2/projects/rick-chen-demo1/jobs`,
        'method': "POST",
        'body': {
          configuration: {
            query: {
              query: queryString,
              maxResults: 100,
              useLegacySql: false,
              timeoutMs: 30000,
            }
          }
        }
      }); 
    }).then(function(response) {
       var job_id=response.result.jobReference.jobId;
       
       //alert(JSON.stringify(response.result.rows,null));
       getQueryResults(job_id);

       //
    }, function(reason) {
      alert('Error: ' + reason.result.error.message);
    });
  };
 
  function getQueryResults(job_id){
    //alert(job_id);
    gapi.client.request({
        path: `https://www.googleapis.com/bigquery/v2/projects/rick-chen-demo1/queries/`+job_id,
        method: "GET"
        }).then(function(response){
            
            bqrows=response.result.rows;
            showMap();
           // alert(bqrows[0].v);
           // alert(JSON.stringify(bqrows,null));
        }
        );
  }

 
//end of bqgis

const INITIAL_VIEW_STATE = {
  latitude: 40.75335534636303, 
  longitude: -73.97321568846345,
  zoom: 14
};

setDefaultCredentials({
    //apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
    //apiVersion: deck.carto.API_VERSIONS.V3,
    //accessToken: ''
    //V2 settings 
    apiVersion: API_VERSIONS.V2,
    username: 'rickruguichen',
    //apiKey: 'default_public'
    apiKey: "f0cfa0c6e590f1e22e70f2e46f3910a47fb7ec78"
    //
    //accessToken: "f0cfa0c6e590f1e22e70f2e46f3910a47fb7ec78"
});

// Add Mapbox GL for the basemap. It's not a requirement if you don't need a basemap.
const base_style="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
const map = new mapboxgl.Map({
  container: 'map',
  style: BASEMAP.VOYAGER, //POSITRON  BASEMAP.VOYAGER
  //style: base_style,
  interactive: false,
  center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
  zoom: INITIAL_VIEW_STATE.zoom
});

// Set the default visible layer
let visibleLayer = 'districts';

// Create Deck.GL map
export const deck = new Deck({
  canvas: 'deck-canvas',
  width: '100%',
  height: '100%',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  onViewStateChange: ({viewState}) => {
    // Synchronize Deck.gl view with Mapbox
    map.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch
    });
  }
});

gapi.load('client', start); 

function showMap()
{
    //alert(JSON.stringify(bqrows,null));
    geoJsonData = [];
    for (let i = 0; i < bqrows.length; i++) {
      var f=bqrows[i].f;
      var geogFeaure = {
          "type": "Feature",
          "geometry": JSON.parse(f[0].v),
         // "properties": JSON.parse(propString)
          "properties": {
            "stationId": f[0].v,
            "stationName": f[2].v,
            "boroughName": f[3].v,
            "line": f[4].v
          }
      }
      geoJsonData.push(geogFeaure);

   }
   //alert(geoJsonData.length);
   geoFeatureCollection = {
     "type": "FeatureCollection",
     "features": geoJsonData
   }
   
  // Add event listener to radio buttons
  document.getElementsByName('layer-visibility').forEach(e => {
  e.addEventListener('click', () => {
    visibleLayer = e.value;
    render();
  });
});
}

//render();

// Function to render the layers. Will be invoked any time visibility changes.
function render() {
  const layers = [
    new GeoJsonLayer({
      id: "stations",
      //type: MAP_TYPES.QUERY,
      data: geoFeatureCollection,
      visible: visibleLayer === 'stations',
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 200,
      //opacity: 0.4,
      pointRadiusScale: 0.3,
      getRadius: 100, //f => 10*(11 - f.properties.scalerank),
      getFillColor: [255, 70, 30, 180],
      autoHighlight: true,
      pickable: true,
      onClick: info =>
          info.object &&
          // eslint-disable-next-line
          alert(`${info.object.properties.stationName} (Line: ${info.object.properties.line})`)
    }),

    new CartoLayer({
      id: 'nyc_boroughs',
      type: MAP_TYPES.TILESET,
      data: 'rick-chen-demo1.bigquery_gis.nyc_borough_boundaries',
      visible: visibleLayer === 'districts',
      filled: true,
      getFillColor: colorBins({
        attr: 'aggregated_total',
        domain: [10, 100, 1e3, 1e4, 1e5, 1e6],
        colors: 'Temps'
      }),
      pointRadiusMinPixels: 2,
      stroked: false
    })
  ];
  // update layers in deck.gl.
  deck.setProps({layers});
}


