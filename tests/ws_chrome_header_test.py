import json
import pytest
from websocket import create_connection

@pytest.fixture
def base_url_ws_api() -> str:
    with open("../pulumi_output.json", "rb") as read_file:
        pulumi_output = json.load(read_file)
    return pulumi_output["wsApiUrl"]


def test_connect_route_should_have_auth_header_passed_back_to_client_from_handshake(base_url_ws_api):
    # create connection
    ws = create_connection(base_url_ws_api)
    # get headers && standardize keys to lower
    headers = dict((k.lower(), v) for k, v in ws.handshake_response.headers.items())
    # headers = dict((k.lower(), v) for k, v in ws.headers.items())
    # close connection
    ws.close()

    assert "sec-websocket-protocol" in headers
    assert "auth" in headers["sec-websocket-protocol"]
