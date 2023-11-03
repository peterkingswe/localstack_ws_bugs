# Localstack WS issues WIP

## Getting started
1) run `make all` in the terminal 
   1) make all will build everything, install deps, and run UI
2) for back to back fresh runs, run `make cleanup all` in the terminal

## Issue
closing browser doesn't trigger disconnect route for websockets


In AWS the disconnect route gets called once the window is closed