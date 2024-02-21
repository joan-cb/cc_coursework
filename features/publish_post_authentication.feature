# @wip
# Feature: user authentication on post endpoint
#         Scenario Outline: user attempts to publish a post on post endpoint without a valid token
#             Given that the user tries to publish a post with <post_title>, <post_owner> and <post_description>
#               And they have not a valid auth-token
#              When they try to publish the post
#              Then they should be returned a 401
#         Examples:
#                   | post_title   | post_owner   | post_description        |
#                   | "some title" | "some owner" | "some description etc." |
