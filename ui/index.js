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

    $("#ws-connection-idle-timeout").click(()=>{
        if (!hasConnection()){
            return;
        }
        alert("if you wait patiently for 10 min without clicking any other btns then disconnect should be called, refresh page to cancel");
        $(":button").addClass('d-none');
        var timer2 = "10:03";
        var interval = setInterval(function() {
            var timer = timer2.split(':');
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            $('.countdown').html(minutes + ':' + seconds);
            if (minutes < 0) clearInterval(interval);
            //check if both minutes and seconds are 0
            if ((seconds <= 0) && (minutes <= 0)){
                clearInterval(interval);
                $(":button").removeClass('d-none');
                $('.countdown').html("Websocket Localstack Test");
            }
            timer2 = minutes + ':' + seconds;
        }, 1000);
    });
});
