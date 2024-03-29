
from behave import given, when, then
import requests
import json
BASE_URL = "http://localhost:3000"
ENDPOINT_LOGIN = "/user_management/login"
ENDPOINT_POST = "/post_management/post"
ENDPOINT_LIKE = "/post_management/like"
headers = {"Content-Type": "application/json"}

@given("the user signs in with their {email} and {password}")
def step_given_signs_in(context, email, password):
    context.request_body = {"email": email, "password": password}
    context.response = requests.post(
    f"{BASE_URL}{ENDPOINT_LOGIN}", 
    data=json.dumps(context.request_body), 
    headers=headers) 
    assert  context.response.status_code == 200
    
@given("the expected {internal_user_id} is returned")
def given_ste_internal_user_id(context, internal_user_id):
    response = context.response.json()
    user_id_returned = response.get("internal_user_id")
    context.auth_token = response.get("auth-token") 
    headers["auth-token"] = context.auth_token
    assert internal_user_id == user_id_returned
    assert context.auth_token is not None

@when("they call the endpoint to publish a post with a {post_title} and {post_description} and {internal_user_id}and a 201 is returned")
def when_step_publish_post(context, post_title, post_description, internal_user_id):
    context.request_body = {"post_title": post_title, "post_description": post_description,"post_owner":internal_user_id}
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

@when("the user with {internal_user_id} will be able to like a {postId}")
def when_step_post_like(context, internal_user_id, postId):
    context.request_body = {"postId": postId, "addLike": True,"internal_user_id": internal_user_id}
    context.response = requests.put(
        f"{BASE_URL}{ENDPOINT_LIKE}",
        data=json.dumps(context.request_body),
        headers=headers
    )
    print(headers)
    assert context.response.status_code == 201

@when("the user with {internal_user_id} will be able to unlike a {postId}")
def when_step_post_unlike(context, postId, internal_user_id):
    context.request_body = {"postId": postId, "removeLike": True,"internal_user_id": internal_user_id}
    context.response = requests.put(
        f"{BASE_URL}{ENDPOINT_LIKE}",
        data=json.dumps(context.request_body),
        headers=headers
    )
    assert context.response.status_code == 201

@then("a like successfully added message is returned")
def when_step_post_like_message(context):
    response_body = context.response.text
    response_json = json.loads(response_body)
    assert response_json.get("message") == "Like successfully added"

@then("a like successfully removed message is returned")
def when_step_post_unlike_message(context):
    response_body = context.response.text
    response_json = json.loads(response_body)
    assert response_json.get("message") == "Like successfully removed"