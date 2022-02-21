<div align="center">
   <img width="150" heigth="150" src="https://webpack.js.org/assets/icon-square-big.svg" />
</div>

## Example: Use deck.gl with Google Maps

Uses [Webpack](https://github.com/webpack/webpack) to bundle files and serves it
with [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server).

## Usage

To run this example, you need a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) and a [map id](https://developers.google.com/maps/documentation/javascript/webgl#vector-id). You can either set an environment variable to run the app:

```bash
export GoogleMapsAPIKey=<google_maps_api_key>
export GoogleMapsMapId=<google_maps_map_id>
export client_id=<BigQueryoAuthClientId>
```

Or set the `GOOGLE_MAPS_API_KEY` and `GOOGLE_MAP_ID`, `client_id' variables in `app.js`.

To install dependencies:

```bash
npm install
# or
yarn
```

Commands:
* `npm start` is the development target, to serve the app and hot reload.
* `npm run build` is the production target, to create the final bundle and write to disk.

## Build as Container and deploy as Cloud-run application

Use Dockerfile,
local test:
export SAMPLE=<app name>
docker build --tag $SAMPLE .
PORT=8080 && docker run --rm -p 8080:${PORT} -e PORT=${PORT} -e GoogleMapsAPIKey=<API Key> -e BigQueryClientId=<BigQueryClientId> -e GoogleMapsMapId=<GoogleMapId>  $SAMPLE

Cloud-Run:
export GOOGLE_CLOUD_PROJECT=<GoogleProjectId>
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/${SAMPLE}
gcloud run deploy ${SAMPLE} \
  # Needed for Manual Logging sample.
  --set-env-vars GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT} \
  --set-env-vars GoogleMapsAPIKey=<API Key> \
  --set-env-vars BigQueryClientId=<BigQueryClientId \
  --set-env-vars GoogleMapsMapId=<GoogleMapId> \
  --image gcr.io/${GOOGLE_CLOUD_PROJECT}/${SAMPLE}



