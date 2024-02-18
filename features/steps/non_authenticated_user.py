# from behave import given, when, then
# import requests
# import json

# BASE_URL = "http://localhost:3000"
# ENDPOINT = "/postManagement/posts"
# HEADERS = {"Content-Type": "application/json"}

# @given("that the user is has no valid auth-token")
# def user_has_no_valid_auth_token(context):
#     pass

# @when('they try to retrieve all posts')
# def step_when(context,attempted_action):
#     context.response = requests.post(
#         f"{BASE_URL}{ENDPOINT}", 
#         data=json.dumps(context.request_body), 
#         headers=HEADERS
#     )
# @then("they should be returned {expected_response}")
# def then_expected_outcome(context, expected_response):
#     assert context.response.body == expected_response