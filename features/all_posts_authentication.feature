
Feature: user authentication on posts endpoint
        Scenario Outline: user attempts to hit endpoints without a valid token to retrieve all posts
            Given that the user has no valid auth-token
             When they try call to retrieve all posts
             Then they should be returned a 401

