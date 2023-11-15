# Localstack WS issues WIP

## Getting started
1) run `make all` in the terminal 
   1) make all will build everything, install deps, and run UI
2) for back to back fresh runs, run `make cleanup all` in the terminal

## Issue
Look to UI, red buttons mean issue with LS
1) WS default not triggering with incorrect routeKey send - https://github.com/localstack/localstack/issues/6615
   1) https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-routes.html
2) WS connect failing when client send auth token in header - https://github.com/localstack/localstack/issues/6521
3) WS not timing out after being idle for 10 min - https://github.com/localstack/localstack/issues/9553
   1) https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html (Idle Connection Timeout)
4) AWS needs stageName to be appended to apiEndpoint in order to invoke it, in Localstack this causes postToConnection to fail - Issue coming soon