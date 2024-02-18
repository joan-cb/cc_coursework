
Feature: user authantication on posts endpoint
        Scenario Outline: user attempts to hit endpoints without a valid token
            Given that the user has no valid auth-token
             When they try call to retrieve all posts
             Then they should be returned a 401
              And they should be returned an error response
