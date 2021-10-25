  
  // 1. Load the JavaScript client library.
  function handleClientLoad() {
    gapi.load('client', initClient);
  }

  function initClient() {
    gapi.client.init({
      config
    }).then(signIn());
  }

  function signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  function makeRequest() {
    gapi.client.request({
        'path': `https://www.googleapis.com/bigquery/v2/projects/rick-chen-demo1/jobs`,
        'method': "POST",
        'body': {
          configuration: {
            query: {
              query: queryString,
              maxResults: 1000,
              useLegacySql: false,
              timeoutMs: 30000,
            }
          }
        }
    }).then(function(resp) {
      writeResponse(resp.result);
    });
  }

  function writeResponse(response) {
    aalert(JSON.stringify(response));
    
  }


  //does not work, trash
  function runQuery() {
    var request = gapi.client.bigquery.jobs.query({
       'projectId': project_id,
       'timeoutMs': '30000',
       'query': queryString
     });
     request.execute(function(response) {     
         alert(response);
         //$('#result_box').html(JSON.stringify(response.result.rows, null));
     });
   }
   module.exports.bqrows=bqrows;