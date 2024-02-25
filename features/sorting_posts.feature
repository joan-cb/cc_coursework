Feature: Validate sorting of posts
        Scenario Outline: Sort posts
            Given the user calls the get posts API endpoint
             When they request payload has a sortBy parameter set to <sort_by>
             Then the posts should be sorted by <sort_by> in descending order
        Examples:
                  | sort_by  |
                  | date     |
                  | comments |
                  | likes    |
