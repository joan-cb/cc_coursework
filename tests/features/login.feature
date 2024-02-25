Feature: log in
        Scenario Outline: user attempts to log in
            Given that the user attempts to log in using a <email> and <password>
             When the log in request is sent to the endpoint
             Then the http status code should be <expected_http_status_code> for that log in request
             Then the response should be <expected_response> for that log in request
        Examples:
                  | email             | password         | expected_http_status_code | expected_response                                                     |
                  | joan@test.com     | joanjoan         | 200                       | {"auth-token": "...", "internal_user_id": "65d8dfe1f8e8f92513ab0baf"} |
                  | testUser@test.com | invalid_password | 401                       | {"message": "Incorrect password"}                                     |
                  | unknown@user.com  | password         | 404                       | {"message": "User does not exist"}                                    |
                  
