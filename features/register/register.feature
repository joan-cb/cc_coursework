Feature: register
        Scenario Outline: user attempts to log in
            Given that the user attempts to register using a <email>, an <password> and a <username>
             When the log in request is sent to the endpoint
             Then the http status code should be <expected_http_status_code>
             Then the response should be <expected_response>
        Examples:
                  | email             | password  | username | expected_http_status_code | expected_response                              |
                  | testUser@test.com | test_test | testUser | 400                       | {"auth-token": "...", "internalUserId": "..."} |
                  | testUser@test.com | test_test | testUser | 400                       | {"message": "Invalid password"}                |
                  | testUser@test.com | test_test | testUser | 400                       | {"message": "User does not exist"}             |
                  

