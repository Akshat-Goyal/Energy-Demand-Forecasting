import pytest
import requests
import json


def test_temperatureforecast():
    URL = "http://api.openweathermap.org/data/2.5/forecast?id=1269843&appid=95e286bae5647877dbb924f3779736a8&units=imperial"
    headers = {'Content-Type': 'application/json'}
    resp = requests.get(url=URL, headers=headers)
    assert resp.status_code == 200
