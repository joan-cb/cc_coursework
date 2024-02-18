from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"
ENDPOINT = "/userManagement/login"
HEADERS = {"Content-Type": "application/json"}

@given('that the user attempts to log in using a {email} and {password}')
def step_given(context, email, password):
    context.request_body = {"email": email, "password": password}
    

@when('the log in request is sent to the endpoint')
def step_when(context):
    context.response = requests.post(
        f"{BASE_URL}{ENDPOINT}", 
        data=json.dumps(context.request_body), 
        headers=HEADERS
    )
    
@then('the http status code should be {expected_http_status_code:d}')
def step_then_status(context, expected_http_status_code):
    print(f"Actual Status Code: {context.response.status_code}")
    print(expected_http_status_code)
    assert context.response.status_code == expected_http_status_code

    
@then('the response should be {expected_response}')
def step_then_response(context, expected_response):
    if context.response.status_code == 200:
        expected_response = json.loads(expected_response) if expected_response else {}
        actual_response = context.response.json()
        assert actual_response.get('auth-token') is not None
        assert actual_response.get('internalUserId') is not None
    elif context.response.status_code in [401, 404]:
        expected_response = json.loads(expected_response) if expected_response else {}
        actual_response = context.response.json()
        assert expected_response == actual_response
    else:
        # Handle other status codes if needed
        pass
