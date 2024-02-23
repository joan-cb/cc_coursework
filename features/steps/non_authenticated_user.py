from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"

@given("that the user has {token_type}")
def user_has_no_valid_auth_token(context, token_type):
    if token_type == "NO_TOKEN":
        context.HEADERS = {"Content-Type": "application/json"}
    elif token_type == "INVALID_TOKEN":
        context.HEADERS = {"Content-Type": "application/json",
        "auth-token":"INVALID_TOKEN"}
    else:
        raise ValueError(f"Invalid scenario: {token_type}")

@when('they try to call {endpoint} with method {http_method}')
def step_when(context, endpoint, http_method):
    if http_method == 'GET':
        context.response = requests.get(
            f"{BASE_URL}{endpoint}",   
            headers=context.HEADERS
        ) 
    elif http_method == 'PUT':
        context.response = requests.put(
            f"{BASE_URL}{endpoint}", 
            headers=context.HEADERS
        )
    else:
        raise ValueError(f"Invalid HTTP method: {http_method}")

@then("they should be returned a {expected_status_code}")
def then_error(context, expected_status_code):
    assert context.response.status_code == 401
    
@then("they should get a {response_error}")
def then_error(context, response_error):
    print(context.response.text,456456465,response_error)
    assert context.response.json() == response_error