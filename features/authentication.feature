Feature: user authantication on posts endpoint
        Scenario: user attempts to retrieve all posts without a valid token
            Given that the user is has no valid auth-token
             When they try to retrieve all posts
             Then they should be returned <expected_response>
