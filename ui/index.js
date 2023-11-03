$.getJSON("./pulumi_output.json", function (json) {

    const hasConnection = () => {
        if (!socket) {
            alert("connect button must be pressed");
            return false;
        }
        return true
    }

    const socketEventListener = () => {
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
    }

    let ws_url = json.wsApiUrl
    let socket = undefined;
    // console.log(ws_url)

    $("#ws-connect-with-token").click(() => {
        if (socket) {
            socket.close();
        }
        socket = new WebSocket(ws_url, ["eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6Il9XQUdTUjlrc3lqQ2drMHJoaW9rbUFxRlhoUWc1RnpteHZRNFg4b2p0VGcifQ.eyJpc3MiOiJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6MzAwMS8iLCJzdWIiOiJzYW1scHxNeUF6dXJlfGpvaG4uZG9lQHVua25vd24uY29tIiwiYXVkIjpbInRlc3QiLCJodHRwOi8vaG9zdC5kb2NrZXIuaW50ZXJuYWw6MzAwMS91c2VyaW5mbyJdLCJpYXQiOjE2OTkwMzA4MTYsImV4cCI6MTY5OTExNzIxNiwiYXpwIjoiIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbImp1c3RfZG9faXQucnVuIl19.eTzdENmWMRQl3-08DpQJwi6gg-raIJQ_-58JKduPwjjaitwk0eVcDulPs9jb0TQ8oGtpSantxyCUY-XuwMiRMI53R1kvLAv0sUoXcre8RJYC18uTeTM5NnZqQHm61wl3sX9q3A1yjMAiyLMU36p3jXeRd4ra_tv96pICjl_TyA1qtMqg4PY3sKNYrVFYHg7ythCHq_bs_ljSyuWlF17479pw4xjwnZY1icV_8SjEXPYNhTemPjXEN9A24KfFZ_gLG7xzcrCMPgwdiJXg9Tvd8ipidjI-Nq7R3mJmQ5NCH3nx39eip1L05J6-bIdC1L1Ydvz3aD9rU3weU0qcZvFN2A"]);
        socketEventListener();
    });

    $("#ws-connect").click(() => {
        if (socket) {
            socket.close();
        }
        socket = new WebSocket(ws_url);
        socketEventListener();
    });

    $("#ws-ping").click(() => {
        if (!hasConnection()) {
            return;
        }
        socket.send(JSON.stringify({
            action: "ping",
            data: {"client_ts": new Date().toLocaleDateString()}
        }));
        console.log("ping pressed");
    });

    $("#ws-disconnect").click(() => {
        if (!hasConnection()) {
            return;
        }
        socket.close();
        socket = undefined;
    });

    $("#ws-default").click(() => {
        if (!hasConnection()) {
            return;
        }
        socket.send({
            action: "idk_what_action_this_is",
            data: {"client_ts": new Date().toLocaleDateString()}
        });
        console.log("default pressed");
    });


    $("#ws-route-not-matching").click(() => {
        if (!hasConnection()) {
            return;
        }
        socket.send(JSON.stringify({
            action: "idk_what_action_this_is",
            data: {"client_ts": new Date().toLocaleDateString()}
        }));
        console.log("route not matching pressed");
    });

    $("#ws-connection-idle-timeout").click(() => {
        if (!hasConnection()) {
            return;
        }
        alert("if you wait patiently for 10 min without clicking any other btns then disconnect should be called, refresh page to cancel");
        $(":button").addClass('d-none');
        var timer2 = "10:03";
        var interval = setInterval(function () {
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
            if ((seconds <= 0) && (minutes <= 0)) {
                clearInterval(interval);
                $(":button").removeClass('d-none');
                $('.countdown').html("Websocket Localstack Test");
            }
            timer2 = minutes + ':' + seconds;
        }, 1000);
    });
});
