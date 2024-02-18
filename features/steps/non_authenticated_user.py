from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"
HEADERS = {"Content-Type": "application/json",
           "auth-token":"INVALID_TOKEN"}

@given("that the user has no valid auth-token")
def user_has_no_valid_auth_token(context):
    pass

@when('they try call to retrieve all posts')
def step_when(context, endpoint):
    context.response = requests.get(
        f"{BASE_URL}{endpoint}", 
        headers=HEADERS
    )

@then("they should be returned a {expected_error_code}")
def then_error(context, expected_error_code):
    print("context.response.status_code",context.response.status_code)
    assert context.response.status_code == 401

@then("they should be returned an error response")
def then_response(context):
    pass