/* global document, google */
import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // get GoogleMapsAPIKey from export command environment
const GOOGLE_MAP_ID = process.env.GoogleMapsMapId; // get GoogleMapID from export command environment
const client_id=process.env.BigQueryClientId; // BigQuery from export command environment, oAuth2 credentials client-id for javascript, no need for client secret 
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

function loadScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

  var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/bigquery';
  const project_id='rick-geo-enterprise'; //'rick-chen-demo1'
  //const queryString= "select  ST_ASGEOJSON(station_geom) as geom, station_id, station_name as name, complex_id,complex_id from bigquery-public-data.new_york_subway.stations";   
  const queryString="select ST_ASGEOJSON(st_geogpoint(longitude, latitude)) as geom, station_id, name, capacity, num_bikes_available,num_docks_available,rental_methods from bigquery-public-data.new_york_citibike.citibike_stations WHERE num_bikes_available > 10" ;
  //var client_id='';  //
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
      // 3. Initialize and make the API request, prompty for sign-in if the app has never been authorized yet
      if(!gapi.auth2.getAuthInstance().isSignedIn.get()) 
      {
        gapi.auth2.getAuthInstance().signIn(); 
      }
      return gapi.client.request({
        'path': `https://www.googleapis.com/bigquery/v2/projects/`+project_id+`/jobs`,
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
        path: `https://www.googleapis.com/bigquery/v2/projects/`+project_id+`/queries/`+job_id,
        method: "GET"
        }).then(function(response){
            
            bqrows=response.result.rows;
            //var f=bqrows[0].f;
            //alert(f[0].v);
            showMap();
           // alert(bqrows[0].v);
           // alert(JSON.stringify(bqrows,null));
        }
        );
  }

 
//end of bqgis
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
            "stationId": f[1].v,
            "name": f[2].v,
            "capacity": parseInt(f[3].v),
            "available": parseInt(f[4].v)
          }
      }
      //alert(JSON.stringify(geogFeaure,null));
      geoJsonData.push(geogFeaure);

   }
   
   geoFeatureCollection = {
     "type": "FeatureCollection",
     "features": geoJsonData
   }
  //alert(JSON.stringify(geoFeatureCollection.features[0],null));
  //show google map:
  loadScript(GOOGLE_MAPS_API_URL).then(() => {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.75335534636303, lng: -73.97321568846345}, 
      zoom: 14,
      mapId: GOOGLE_MAP_ID
    });
  
    const overlay = new DeckOverlay({
      layers: [
        new GeoJsonLayer({
          id: "stations",
          //type: MAP_TYPES.QUERY,
          data: geoFeatureCollection,
          visible: true,
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusMaxPixels: 200,
          //opacity: 0.4,
          pointRadiusScale: 0.3,
          getRadius: f =>  7 * f.properties.available,
          getFillColor: [255, 70, 30, 180],
          autoHighlight: true,
          pickable: true,
          onClick: info =>
              info.object &&
              // eslint-disable-next-line
              alert(`${info.object.properties.name} (Bikes: ${info.object.properties.available})`)
        }),
        new ArcLayer({
          id: 'arcs',
          data: geoFeatureCollection,
          dataTransform: d => d.features.filter(f => f.properties.available > 50),
          // Styles
          getSourcePosition: f => [-73.941662888254513, 40.748787961995525], // London
          getTargetPosition: f => f.geometry.coordinates,
          getSourceColor: [0, 128, 200],
          getTargetColor: [200, 0, 80],
          getWidth: 3
        })
      ]
    });
  
    overlay.setMap(map);
  });
  
  
}

//render



