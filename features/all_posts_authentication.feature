
Feature: user authentication on posts endpoint
        Scenario Outline: user attempts to hit endpoints without an invalid token or no token
            Given that the user has <token_type>
             When they try to call <endpoint> with method <http_method>
             Then they should be returned a <expected_status_code>
              And they should get a <response_error>
        Examples:
                  | token_type    | endpoint                 | http_method | expected_status_code | response_error             |
                  | INVALID_TOKEN | /post_management/post    | GET         | 401                  | {"error":"Invalid token."} |
                  | NO_TOKEN      | /post_management/posts   | GET         | 401                  | {"error":"Access denied."} |
                  | INVALID_TOKEN | /post_management/like    | PUT         | 401                  | {"error":"Invalid token."} |
                  | NO_TOKEN      | /post_management/comment | PUT         | 401                  | {"error":"Access denied."} |

