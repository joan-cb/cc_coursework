const express = require("express")
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const verify_token = require("../verifyToken")
const { post_validation } = require("../validations/validation")
const mongoose = require("mongoose")

router.post('/post', verify_token, async (req, res) => {
    const { error } = post_validation(req.body);

    if (error) {
        return res.status(400).send({ message: error["details"][0]["message"] });
    }

    console.log(req.body);

    try {
        const owner_id = req.body.post_owner;
        if (!mongoose.Types.ObjectId.isValid(owner_id)) {
            return res.status(400).send({ message: "Invalid post_owner ID format" });
        }

        const user = await User.findById(owner_id);
        if (!user) {
            return res.status(400).send({ message: "Invalid post_owner ID" });
        }

        const post = new Post({
            post_title: req.body.post_title,
            post_owner: owner_id,
            post_description: req.body.post_description,
        });

        const saved_post = await post.save();
        res.status(201).send({"message":"post successfully created"});
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/posts", verify_token, async (req, res) => {
    try {
        const all_posts = await Post.find();

        let sorted_posts = all_posts;

        if (req.body.sortBy) {
            const sortBy = req.body.sortBy.toLowerCase();

            switch (sortBy) {
                case 'date':
                    sorted_posts.sort((a, b) => {
                        const dateA = new Date(a.post_publication_date_time);
                        const dateB = new Date(b.post_publication_date_time);
                        return dateB - dateA;
                    });
                    break;
                case 'comments':
                    sorted_posts.sort((a, b) => {
                        return b.post_comments.length - a.post_comments.length;
                    });
                    break;
                case 'likes':
                    sorted_posts.sort((a, b) => {
                        return b.user_likes.length - a.user_likes.length;
                    });
                    break;
                default:
                    return res.status(400).send({"error":'Invalid sortBy parameter. Accepted values are "likes", "dates" or "comments"'});
            }
        }

        const posts_with_internal_id = sorted_posts.map(post => ({
            ...post._doc,
            internal_id: post._id,
        }));

        const postsCount = all_posts.length;

        res.send({ postsCount, posts: posts_with_internal_id });
    } catch (err) {
        console.error(err); // Log any errors
        res.status(400).send({ message: err });
    }
});


    router.get('/post', verify_token, async (req, res) => {
        try {
            const item_id = req.body.id;
            // Validate if item_id is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(item_id)) {
                return res.status(400).send('Invalid ID format');
            }
    
            const item = await Post.findById(item_id);
    
            if (!item) {
                return res.status(404).send('Item not found');
            }
    
            // Item found, 'item' is the document matching the provided _id
            res.json(item);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    });
    

    router.put('/like', verify_token, async (req, res) => {
        try {
            const { postId, internal_user_id, addLike, removeLike } = req.body;
    
            // Validate if postId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({"error": 'Invalid post ID'});
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internal_user_id)) {
                return res.status(400).send({"error": 'Invalid user ID'});
            }
    
            // Check if the post_owner is equal to internal_user_id
            const post = await Post.findById(postId);
            if (post && post.post_owner.toString() === internal_user_id) {
                return res.status(401).send({"error": 'The post owner cannot like their own post'});
            }
    
            let updateQuery = {};
    
            if (addLike && !removeLike) {
                updateQuery.$addToSet = { user_likes: internal_user_id };
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    updateQuery,
                    { new: true } // Return the updated document
                );
    
    
                return res.status(201).send({"message": 'Like successfully added'});
            } else if (!addLike && removeLike) {
                updateQuery.$pull = { user_likes: internal_user_id };
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    updateQuery,
                    { new: true } // Return the updated document
                );
    
                return res.status(201).send({"message": 'Like successfully removed'});
            } else {
                // If both addLike and removeLike are provided, return a bad request
                return res.status(400).send({"error": 'Provide either addLike or removeLike, but not both'});
            }
    
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    });
    
    
    
    router.put('/comment', verify_token, async (req, res) => {
        try {
            const { postId, internal_user_id, comment } = req.body;
    
            // Validate if postId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({"error":'Invalid post ID format'});
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internal_user_id)) {
                return res.status(400).send({"error":'Invalid user ID format'});
            }
    
            // Check if 'comment' is provided in the request payload
            if (!comment) {
                return res.status(400).send('comment is required');
            }
    
            // Update the post_comments array with the new comment
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $push: {
                            post_comments: {
                            internal_user_id: internal_user_id,
                            comment: comment,
                            comment_publication_date_time: new Date(),
                        },
                    },
                },
                { new: true } // Return the updated document
            );
    
            if (!updatedPost) {
                return res.status(404).send('Post not found');
            }
    
            res.json(updatedPost);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    });
    


router.delete('/post/:id', verify_token, async (req, res) => {
    try {
        const postId = req.params.id;
        // Validate if postId is a valid ObjectId before deleting the post
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send('Invalid post ID format');
        }

        // Find the post by ID and delete it
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }

        res.status(200).json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
    

router.delete('/posts', verify_token, async (req, res) => {
    try {
        // Delete all posts
        const delete_posts = await Post.deleteMany({});

        if (delete_posts.deleted_count === 0) {
            return res.status(404).send('No posts found to delete');
        }

        res.status(200).json({ message: 'All posts deleted successfully', delete_posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
