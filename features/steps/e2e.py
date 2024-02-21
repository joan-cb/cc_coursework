
from behave import given, when, then
import requests
import json


BASE_URL = "http://localhost:3000"
ENDPOINT_LOGIN = "/userManagement/login"
ENDPOINT_POST = "/postManager/post"
ENDPOINT_LIKE = "/postManager/like"
headers = {"Content-Type": "application/json"}

@given("the user signs in with their {email} and {password}")
def step_given(context, email, password):
    context.request_body = {"email": email, "password": password}
    context.response = requests.post(
    f"{BASE_URL}{ENDPOINT_LOGIN}", 
    data=json.dumps(context.request_body), 
    headers=headers) 
    assert  context.response.status_code == 200
    
@given("the expected {internalUserId} is returned")
def set_user_id(context,internalUserId):
    response = context.response.json()
    user_id_returned = response.get("internalUserId")
    context.auth_token = response.get("auth-token") 
    headers["auth-token"] = context.auth_token
    assert internalUserId == user_id_returned
    assert context.auth_token is not None

@when("they call the endpoint to publish a post with a {post_title} and {post_description} and {internalUserId}")
def when_step(context,post_title, post_description, internalUserId):
    context.request_body = {"post_title": post_title, "post_description": post_description,"post_owner":internalUserId}
    try:
        context.response = requests.post(
            f"{BASE_URL}{ENDPOINT_POST}",
            data=json.dumps(context.request_body),
            headers=headers
        )
        context.response.raise_for_status()  
        assert context.response.status_code == 201
    except requests.exceptions.RequestException as e:
        print(f"Error during API request: {e}")

@when("the user with {internalUserId} will be able to like a {post_id_to_like}")
def when_like_step(context, post_id_to_like, internalUserId):
    context.request_body = {"postId": post_id_to_like, "addLike": True,"internalUserId": internalUserId}
    print(json.dumps(context.request_body))
    print(headers)
    context.response = requests.put(
        f"{BASE_URL}{ENDPOINT_LIKE}",
        data=json.dumps(context.request_body),
        headers=headers
    )
    print(context.response)
    assert context.response.status_code == 201
    response_body = context.response.text
    response_json = json.loads(response_body)
    assert response_json.get("message") == "like successfully added"

# # @when("when they like a {post_id_to_like}")


# Feature: log in
#         Scenario Outline: user attempts to log in
#             Given that the user attempts to log in using a <email> and <password>
#              When the log in request is sent to the endpoint
#              Then the http status code should be <expected_http_status_code> for that log in request
#              Then the response should be <expected_response> for that log in request
#         Examples:
#                   | email            | password         | expected_http_status_code | expected_response                              |
#                   | jkd@dedj.com     | 23033323         | 200                       | {"auth-token": "...", "internalUserId": "..."} |
#                   | jkd@dedj.com     | invalid_password | 401                       | {"message": "Incorrect password"}              |
#                   | unknown@user.com | password         | 404                       | {"message": "User does not exist"}             |
                  
