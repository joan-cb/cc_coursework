from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"
ENDPOINT = "/user_management/registration"
HEADERS = {"Content-Type": "application/json"}
    
@given('that the user attempts to register using a {email}, an {password} and a {user_name}')
def step_given_registration_attempt(context, email, password, user_name):
    context.request_body = {"email": email, "password": password, "user_name": user_name}
    

@when('the register request is sent to the endpoint')
def step_when_registration_endpoint_call(context):
    context.response = requests.post(
        f"{BASE_URL}{ENDPOINT}", 
        data=json.dumps(context.request_body), 
        headers=HEADERS
    )
    
@then('the http status code should be {expected_http_status_code:d}')
def step_then_registration_call_status(context, expected_http_status_code):
    assert context.response.status_code == expected_http_status_code

@then('the response should be {expected_response}')
def step_then_registration_call_expected_response(context,expected_response):
    assert context.response.text == expected_response
