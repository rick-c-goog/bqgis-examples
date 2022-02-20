// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START functions_http_content]
const escapeHtml = require('escape-html');
/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
 exports.bqGETStations = async (req, res) => {
    // Gets a reference to a Cloud Spanner instance and database
    const instance = spanner.instance(instanceId);
    const database = instance.database(databaseId);
  
    // The query to execute
    const query = {
      sql: 'SELECT * FROM Albums',
    };
  
    // Execute the query
    try {
      const results = await database.run(query);
      const rows = results[0].map(row => row.toJSON());
      rows.forEach(row => {
        res.write(
          `SingerId: ${row.SingerId}, ` +
            `AlbumId: ${row.AlbumId}, ` +
            `AlbumTitle: ${row.AlbumTitle}\n`
        );
      });
      res.status(200).end();
    } catch (err) {
      res.status(500).send(`Error querying Spanner: ${err}`);
    }
  };

  const {BigQuery} = require('@google-cloud/bigquery');
  const bigquery = new BigQuery();
    // [END bigquery_client_default_credentials]
  async function query(queryString) {
      // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
      const options = {
        query: queryString,
        // Location must match that of the dataset(s) referenced in the query.
        //location: 'US',
      };
  
      // Run the query as a job
      const [job] = await bigquery.createQueryJob(options);
      console.log(`Job ${job.id} started.`);
  
      // Wait for the query to finish
      const [rows] = await job.getQueryResults();
  
      // Print the results
      //console.log('Rows:');
      var tableData=[];
      rows.forEach(row => {
          tableData.push(
               {"id": `${row.id}`, "geom": `${row.geom}`});
              });
      //tableData.forEach(rs => console.log(rs));
      return tableData;
    }

  // [END spanner_functions_quickstart]
