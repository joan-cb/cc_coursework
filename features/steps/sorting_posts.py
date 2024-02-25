import requests
from behave import given, when, then
from datetime import datetime
headers = {"Content-Type": "application/json","auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRhMjczZDllYWUyYzRiMGMxNWI0OGYiLCJpYXQiOjE3MDg4NzAzNTgsImV4cCI6MTcwODg3Mzk1OH0._RHJl7WklzY87gSiAVD118XAfbsQneLNzUuvr1t02t0"}

@given('the user calls the get posts API endpoint')
def step_given_api_endpoint(context):
    BASE_URL = "http://localhost:3000"
    context.endpoint = BASE_URL + "/post_management/posts"
@when('they request payload has a sortBy parameter set to {sort_by}')
def step_when_user_requests_with_sort_by(context, sort_by):

    response = requests.get(context.endpoint, headers=headers, json={'sortBy': sort_by})
    context.response = response

@then('the posts should be sorted by {sort_by} in descending order')
def step_then_response_sorted_by(context, sort_by):
    data = context.response.json()
    sorted_posts = data.get('posts')   
    if sort_by == 'date':
        date_format = "%Y-%m-%dT%H:%M:%S.%fZ"
        assert all(datetime.strptime(sorted_posts[i]['post_publication_date_time'], date_format) >= datetime.strptime(sorted_posts[i+1]['post_publication_date_time'], date_format) for i in range(len(sorted_posts)-1))
    elif sort_by == 'comments':
        assert all(len(sorted_posts[i]['post_comments']) >= len(sorted_posts[i+1]['post_comments']) for i in range(len(sorted_posts)-1))
    elif sort_by == 'likes':
        assert all(len(sorted_posts[i]['user_likes']) >= len(sorted_posts[i+1]['user_likes']) for i in range(len(sorted_posts)-1))
    else:
        response_error = context.response.json().get('error', '')
        expected_error = 'Invalid sortBy parameter. Accepted values are "likes", "dates" or "comments"'
        assert response_error == expected_error, f"Unexpected error message: {response_error}. Expected: {expected_error}"
