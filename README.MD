# LS request context stage comes back w/ value of None

## Getting started
1) run `make all`
   1) make all will build everything, install deps, and run test

## Issue
In AWS value comes back as 'ws'

[see todo here where we make the assert](./ws_api_route_handler_lambda/lambda_function.py)

Please note that this is a non-blocking issue. If the assert within the lambda is taken out everything works as it should