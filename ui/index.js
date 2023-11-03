$.getJSON("./pulumi_output.json", function (json) {

    const hasConnection = ()=>{
        if (!socket){
            alert("connect button must be pressed");
            return false;
        }
        return true
    }

    let ws_url = json.wsApiUrl
    let socket = undefined;
    console.log(ws_url)

    $("#ws-connect").click(()=>{
        socket = new WebSocket(ws_url);
        // Connection opened
        socket.addEventListener("open", (event) => {
            alert("[open] Connection established");
            console.log(event)
        });

        socket.addEventListener("message", (event) => {
            alert(`[message] Data received from server: ${event.data}`);
            console.log(event)
        });

        socket.addEventListener("close", (event) => {
            if (event.wasClean) {
                alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                alert('[close] Connection died');
            }
            console.log(event)
        });

        socket.addEventListener("error", (error) => {
            console.log(error)
            alert(`[error]`);
        });

    });

    $("#ws-ping").click(()=>{
        if (!hasConnection()){
            return;
        }
        socket.send(JSON.stringify({
            action: "ping",
            data: {"client_ts": new Date().toLocaleDateString()}
        }));
        console.log("ping pressed");
    });

    $("#ws-disconnect").click(()=>{
        if (!hasConnection()){
            return;
        }
        socket.close();
        socket = undefined;
    });

    $("#ws-default").click(()=>{
        if (!hasConnection()){
            return;
        }
        socket.send({
            action: "idk_what_action_this_is",
            data: {"client_ts": new Date().toLocaleDateString()}
        });
        console.log("default pressed");
    });


    $("#ws-route-not-matching").click(()=>{
        if (!hasConnection()){
            return;
        }
        socket.send(JSON.stringify({
            action: "idk_what_action_this_is",
            data: {"client_ts": new Date().toLocaleDateString()}
        }));
        console.log("route not matching pressed");
    });

});
