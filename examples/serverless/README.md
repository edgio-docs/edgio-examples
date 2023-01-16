# Layer0 Serverless Example

This example project shows you how to deploy serverless functions on Layer0 without a web framework.

## How it works

Routes are defined in routes.ts. Each points to a serverless function in the functions directory.
Configuration is explicit so the project structure is entirely up to you.

## Running locally

```
0 dev --cache # enable caching in development
```

Try some test URLs:

```
LAYER0_CURL_SHOW_BODY=true 0 curl http://localhost:3000/hello/world
LAYER0_CURL_SHOW_BODY=true 0 curl http://localhost:3000/this/route/is/not/defined
curl -v -H 'Content-Encoding: gzip' --data-binary @requests/logs.json.gz http://localhost:3000/log
```

## Deploying

```
0 deploy
```
