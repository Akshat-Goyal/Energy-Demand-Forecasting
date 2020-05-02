import pytest
import requests
import json


def test_prediction():
    url = "http://localhost:4000/model/predict"
    headers = {'Content-Type': 'application/json'}
    dateTime = {
        "fromDate": "2020-04-21",
        "fromTime": "15:00",
        "toDate": "2020-04-21",
        "toTime": "17:00"
    }
    resp = requests.post(url, data=json.dumps(dateTime), headers=headers)
    assert resp.status_code == 200
