import pytest
import requests
import json


def test_register():
    url = "http://localhost:4000/user/exist"
    headers = {'Content-Type': 'application/json'}
    user = {"username": "testing",
            "email": "testing@gmil.com",
            "phoneNo": "4445556669",
            }

    resp = requests.post(url, data=json.dumps(user), headers=headers)
    assert resp.status_code == 200

    data = resp.text
    if data == "{}":
        url = "http://localhost:4000/user/add"
        headers = {'Content-Type': 'application/json'}
        user = {"username": "testing",
                "email": "testing@gmail.com",
                "phoneNo": "4445556669",
                "firstName": "testing",
                "lastName": "testing",
                "password": "Hello@123",
                "confirmPassword": "Hello@123",
                "userType": "Owner"
                }
        resp = requests.post(url, data=json.dumps(user), headers=headers)
        assert resp.status_code == 200


def test_login():
    url = "http://localhost:4000/user/login"
    headers = {'Content-Type': 'application/json'}
    user = {"username": "John",
            "password": "Hello@123",
            }

    resp = requests.post(url, data=json.dumps(user), headers=headers)
    assert resp.status_code == 200
