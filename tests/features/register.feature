Feature: register
        Scenario Outline: user attempts to register
            Given that the user attempts to register using a <email>, an <password> and a <user_name>
             When the register request is sent to the endpoint
             Then the http status code should be <expected_http_status_code>
              And the response should be <expected_response>
        Examples:
                  | email              | password  | user_name  | expected_http_status_code | expected_response                                                    |
                  | testUser@test.com  | test_test | testUser  | 400                       | {"message":"user already exists"}                                    |
                  | testUser2@mail.com | t         | testUser2 | 404                       | {"message":"\"password\" length must be at least 6 characters long"} |
                  | testUs @           | test_test | testUser  | 404                       | {"message":"\"email\" must be a valid email"}                        |
                  
