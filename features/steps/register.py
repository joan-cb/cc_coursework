from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"
ENDPOINT = "/userManagement/registration"
HEADERS = {"Content-Type": "application/json"}
    
@given('that the user attempts to register using a {email}, an {password} and a {username}')
def step_given(context, email, password, username):
    context.request_body = {"email": email, "password": password, "username": username}
    

@when('the register request is sent to the endpoint')
def step_when(context):
    context.response = requests.post(
        f"{BASE_URL}{ENDPOINT}", 
        data=json.dumps(context.request_body), 
        headers=HEADERS
    )
    
@then('the http status code should be {expected_http_status_code:d}')
def step_then_status(context, expected_http_status_code):
    assert context.response.status_code == expected_http_status_code

@then('the response should be {expected_response}')
def step_then_expected_response(context,expected_response):
    assert context.response.text == expected_response
