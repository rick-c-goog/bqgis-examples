//import {Deck} from '@deck.gl/core';
//import {CompositeLayer, log} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import gapi from gclient;
//const SCOPE = 'https://www.googleapis.com/auth/bigquery';
//const client_id='99330940923-88hbc1aktvke92ckjn30d4mtl0egnr0u.apps.googleusercontent.com';

//var config = {
//    'client_id': client_id,
//    'scope': SCOPE
//};
//const project_id='rick-chen-demo1';

const defaultProps = {
    // (String, required): data resource to load. table name, sql query or tileset name.
    data: null,
    onDataLoad: {type: 'function', value: data => {}, compare: false},
    onDataError: {type: 'function', value: null, compare: false, optional: true},
    SCOPE: null, 
    client_id: null,
    project_id: null, 
    // (String, optional): name of the `geo_column` in the CARTO platform. Use this override the default column ('geom'), from which the geometry information should be fetched.
    geoColumn: null,
  
    // (Array<String>, optional): names of columns to fetch. By default, all columns are fetched.
    columns: {type: 'array', value: null}
  };


export default class BigQueryLayer extends GeoJsonLayer {
  
    initializeState() {
        this.state = {
          data: null,
          SCOPE: null,
          client_id: null,
          project_id: null
        };
      }

    updateState({props, oldProps, changeFlags}) {
        //this._checkProps(props);
        const {data: source, SCOPE,client_id, geoColumn, columns} = this.props;
        const shouldUpdateData =
          changeFlags.dataChanged ||
          props.geoColumn !== oldProps.geoColumn ||
          JSON.stringify(props.columns) !== JSON.stringify(oldProps.columns);
    
        if (shouldUpdateData) {
          this.setState({data: null});
          await gapi.load('client', start); ;
        }
      }
    
    //bq related functions:
    async _start() {
      config={
        'client_id': this.props.client_id,
        'scope': this.props.SCOPE
      }
      // 2. Initialize the JavaScript client library.
      gapi.client.init(config).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.request({
          'path': `https://www.googleapis.com/bigquery/v2/projects/`+this.props.project_id+`/jobs`,
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
         _getQueryResults(job_id);
    
         //
      }, function(reason) {
        alert('Error: ' + reason.result.error.message);
      });
    };
    
    _getQueryResults(job_id){
      //alert(job_id);
      gapi.client.request({
          path: `https://www.googleapis.com/bigquery/v2/projects/rick-chen-demo1/queries/`+job_id,
          method: "GET"
          }).then(function(response){
              
              var bqrows=response.result.rows;
              _getGeometryData(bqrows);          
          }
          );
    }
    
    _getGemeotryData(bqrows)
    {
        //alert(JSON.stringify(bqrows,null));
        var geoJsonData = [];
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
       let data;
        data = {
         "type": "FeatureCollection",
         "features": geoJsonData
       }
       
       this.setState({data});
       this.props.onDataLoad(data);
       //return geoFeatureCollection;
    }


}






  
  