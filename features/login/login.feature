Feature: log in
        Scenario Outline: user attempts to log in
            Given that the user attempts to log in using a <email> and <password>
             When the log in request is sent to the endpoint
             Then the http status code should be <expected_http_status_code>
             Then the response should be <expected_response>
        Examples:
                  | email            | password         | expected_http_status_code | expected_response                              |
                  | jkd@dedj.com     | 23033323         | 200                       | {"auth-token": "...", "internalUserId": "..."} |
                  | jkd@dedj.com     | invalid_password | 401                       | {"message": "Incorrect password"}              |
                  | unknown@user.com | password         | 404                       | {"message": "User does not exist"}             |
                  

