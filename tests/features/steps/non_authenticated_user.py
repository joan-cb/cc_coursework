from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"

@given("that the user has {token_type}")
def step_given_unauthenticated(context, token_type):
    if token_type == "NO_TOKEN":
        context.HEADERS = {"Content-Type": "application/json"}
    elif token_type == "INVALID_TOKEN":
        context.HEADERS = {"Content-Type": "application/json",
        "auth-token":"INVALID_TOKEN"}
    else:
        raise ValueError(f"Invalid scenario: {token_type}")

@when('they try to call {endpoint} with method {http_method}')
def step_when_unauthenticated_call(context, endpoint, http_method):
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
def step_then_unauthenticated_call_error(context, expected_status_code):
    assert context.response.status_code == 401
    
@then("they should get a {response_error}")
def step_then_unauthenticated_call_response(context, response_error):
    assert context.response.text == response_error

