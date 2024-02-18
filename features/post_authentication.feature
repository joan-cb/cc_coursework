Feature: user authentication on post endpoint
        Scenario Outline: user attempts to hit post endpoints without a valid token to retrieve a post by ID
            Given that the user has no valid auth-token
             When they try call to retrieve the post <postID>
             Then they should be returned a 401
        Examples:
                  | postID                     |
                  | "65d08809ac2d9176e94a8bfd" |
