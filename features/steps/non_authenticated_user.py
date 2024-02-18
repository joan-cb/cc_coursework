from behave import given, when, then
import requests
import json

BASE_URL = "http://localhost:3000"
ENDPOINT_ALL_POSTS = "/postManager/post"
ENDPOINT_POST = "/postManager/post"

@given("that the user has no valid auth-token")
def user_has_no_valid_auth_token(context):
    context.HEADERS = {"Content-Type": "application/json",
           "auth-token":"INVALID_TOKEN"}

@when('they try call to retrieve all posts')
def step_when(context):
    context.response = requests.get(
        f"{BASE_URL}{ENDPOINT_ALL_POSTS}", 
        headers=context.HEADERS
    )

@then("they should be returned a 401")
def then_error(context):
    print("context.response.status_code",context.response.status_code, True)    
    assert context.response.status_code == 401


@when("they try call to retrieve the post {postID}")
def step_when_by_ID(context,postID):
    context.request_body = {"id": postID}
    context.response = requests.get(
    f"{BASE_URL}{ENDPOINT_POST}", 
    headers=context.HEADERS
)
        
@given('that the user tries to publish a post with {post_title}, {post_owner} and {post_description}')
def step_given(context, post_title, post_owner, post_description):
    context.request_body = {"post_title": post_title, "post_owner": post_owner, "post_description": post_description}

@given("they have not a valid auth-token")
def step_token(context):
     context.HEADERS = {"Content-Type": "application/json",
           "auth-token":"INVALID_TOKEN"}

@when('they try to publish the post')
def step_when_publish(context):
    context.response = requests.post(
        f"{BASE_URL}{ENDPOINT_POST}", 
        headers=context.HEADERS
    )