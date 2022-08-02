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

# TODO exception ws msg doesn't send but you can see exception in logs 
def test_gone_exception_should_return_true(base_url_ws_api):
    # create connection
    ws = create_connection(base_url_ws_api)
    # send ping msg to ws
    ws.send(json.dumps(ping_msg(), default=str))
    # get pong response
    res = json.loads(ws.recv())
    # close connection
    ws.close()

    assert res["action"] == "pong"
    assert res["data"]["message"].lower() == "exception hit"