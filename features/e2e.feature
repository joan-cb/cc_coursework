
Feature: Social Media Application Functionality
        Scenario Outline: User Sign-In, Authorization, and Post Interactions e2e
            Given the user signs in with their <email> and <password>
              And the expected <internalUserId> is returned
             When they call the endpoint to publish a post with a <post_title> and <post_description> and <internalUserId>
              And the user with <internalUserId> will be able to like a <post_id_to_like>
        Examples:
                  | email         | password   | internalUserId           | post_title             | post_description    | post_id_to_like          |
                  | olga@test.com | ssssssssse | 65d6394a0866364a04cf4f98 | a very title !@        | some random desc    | 65d5021afcb57a72f66cb2ed |
                  | nick@test.com | ssssssssse | 65d639560866364a04cf4f9b | a very very nice title | another random desc | 65d5021afcb57a72f66cb2ed |


#             Given the following users register with the application:
#                   | Username | Email            | Password |
#                   | Olga     | olga@example.com | olga123  |
#                   | Nick     | nick@example.com | nick123  |
#                   | Mary     | mary@example.com | mary123  |

#         Scenario: User Registration, Sign-In, Authorization, and Post Interactions e2e

#             Given Olga signs in with her username and password to get her token
#               And Nick signs in with his username and password to get his token
#               And Mary signs in with her username and password to get her token

#              When Olga calls the API (any endpoint) without using a token
#              Then the call should be unsuccessful as the user is unauthorized

#              When Olga posts a text using her token
#               And Nick posts a text using his token
#               And Mary posts a text using her token

#              Then Nick and Olga browse available posts in chronological order in the MiniWall
#               And there should be three posts available
#               But there are no likes yet

#              When Nick and Olga comment Mary’s post in a round-robin fashion (one after the other)
#               And Mary attempts to comment her post
#              Then the call should be unsuccessful as an owner cannot comment owned posts

#              When Mary can see posts in chronological order (newest posts are on the top as there are no likes yet)
#               And Mary can see the comments for her posts

#              When Nick and Olga like Mary’s posts
#               And Mary attempts to like her posts
#              Then the call should be unsuccessful as an owner cannot like their posts

#              Then Mary can see that there are two likes in her posts

#              When Nick can see the list of posts
#              Then Mary’s post, having two likes, should be shown at the top