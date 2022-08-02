import json
import pytest
import random
from datetime import date
from websocket import create_connection


def get_random_number(floor: int = 0, ceiling: int = 5) -> int:
    return random.randint(floor, ceiling)


def ping_msg() -> dict:
    return {
        "action": "ping",
        "data": {"client_ts": date.today()},
    }


@pytest.fixture
def base_url_ws_api() -> str:
    with open("../pulumi_output.json", "rb") as read_file:
        pulumi_output = json.load(read_file)
    return pulumi_output["wsApiGw"]["apiEndpoint"] + "/ws/"


# ping works
def test_ping_route(base_url_ws_api):
    # create connection
    ws = create_connection(base_url_ws_api)
    # send ping msg to ws
    ws.send(json.dumps(ping_msg(), default=str))
    # get pong response
    res = json.loads(ws.recv())
    # close connection
    ws.close()

    assert res["status"] is True
    assert res["action"] == "pong"
    assert len(res["data"]) > 0

# TODO not hitting default route | returns 200 | somethings off with iac
def test_default_route(base_url_ws_api):
    msg = ping_msg()

    # any of below should trigger default route since action prop is used to route ws requests via IAC
    # msg["action"] = ""
    del msg["action"]
    # msg["action"] = "route_doesnt_exist"

    # connect to WS
    ws = create_connection(base_url_ws_api)
    # send msg to ws with no matching action should hit default
    ws.send(json.dumps(msg, default=str))
    # hangs here
    res = json.loads(ws.recv())
    # close connection
    ws.close()

    assert res["status"] is False
    assert res["action"] == "statusMsg"
    assert res["data"]["from"].lower() == "system"
    assert res["data"]["message"].lower() == "unknown action"
