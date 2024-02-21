const express = require("express")
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const verifyToken = require("../verifyToken")
const { postValidation } = require("../validations/validation")
const mongoose = require("mongoose")

router.post('/post', verifyToken, async (req, res) => {
    const { error } = postValidation(req.body);

    if (error) {
        console.log(error);
        return res.status(400).send({ message: error["details"][0]["message"] });
    }

    console.log(req.body);

    try {
        // Additional validation to check if post_owner exists in db.users
        const ownerId = req.body.post_owner;
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).send({ message: "Invalid post_owner ID format" });
        }

        const user = await User.findById(ownerId);
        console.log("User:", user);

        if (!user) {
            console.log("User not found");
            return res.status(400).send({ message: "Invalid post_owner ID" });
        }

        const post = new Post({
            post_title: req.body.post_title,
            post_owner: ownerId,
            post_description: req.body.post_description,
        });

        console.log("try");
        const savedPost = await post.save();
        res.status(201).send(savedPost);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/posts", verifyToken, async (req, res) => {
    try {
        const allPosts = await Post.find();

        let sortedPosts = allPosts;

        if (req.body.sortBy) {
            const sortBy = req.body.sortBy.toLowerCase();

            switch (sortBy) {
                case 'date':
                    sortedPosts.sort((a, b) => {
                        const dateA = new Date(a.post_publication_date_time);
                        const dateB = new Date(b.post_publication_date_time);
                        return dateB - dateA;
                    });
                    break;
                case 'comments':
                    sortedPosts.sort((a, b) => {
                        return b.post_comments.length - a.post_comments.length;
                    });
                    break;
                case 'likes':
                    sortedPosts.sort((a, b) => {
                        return b.user_likes.length - a.user_likes.length;
                    });
                    break;
                default:
                    return res.status(400).send('Invalid sortBy parameter');
            }
        }

        const postsWithInternalId = sortedPosts.map(post => ({
            ...post._doc,
            internalId: post._id,
        }));

        res.send(postsWithInternalId);
    } catch (err) {
        console.error(err); // Log any errors
        res.status(400).send({ message: err });
    }
});

    router.get('/post', verifyToken, async (req, res) => {
        try {
            const itemId = req.body.id;
            console.log(itemId);
    
            // Validate if itemId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                return res.status(400).send('Invalid ID format');
            }
    
            const item = await Post.findById(itemId);
    
            if (!item) {
                return res.status(404).send('Item not found');
            }
    
            // Item found, 'item' is the document matching the provided _id
            res.json(item);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    

    router.put('/like', verifyToken, async (req, res) => {
        try {
            const { postId, internalUserId, addLike, removeLike } = req.body;
    
            // Validate if postId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({"error": 'Invalid post ID'});
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internalUserId)) {
                return res.status(400).send({"error": 'Invalid user ID'});
            }
    
            let updateQuery = {};
    
            if (addLike && !removeLike) {
                updateQuery.$addToSet = { user_likes: internalUserId };
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    updateQuery,
                    { new: true } // Return the updated document
                );
    
                // Log the whole post object after a like is successfully added
                console.log('Post object after like added:', updatedPost);
    
                return res.status(201).send({"message": 'like successfully added'});
            } else if (!addLike && removeLike) {
                updateQuery.$pull = { user_likes: internalUserId };
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    updateQuery,
                    { new: true } // Return the updated document
                );
    
                // Log the whole post object after a like is successfully removed
                console.log('Post object after like removed:', updatedPost);
    
                return res.status(201).send({"message": 'like successfully removed'});
            } else {
                // If both addLike and removeLike are provided, return a bad request
                return res.status(400).send({"error": 'Provide either addLike or removeLike, but not both'});
            }
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    

    // router.put('/like', verifyToken, async (req, res) => {
    //     try {
    //         const { postId, internalUserId, addLike, removeLike } = req.body;
    
    //         // Validate if postId is a valid ObjectId before querying the database
    //         if (!mongoose.Types.ObjectId.isValid(postId)) {
    //             return res.status(400).send({"error":'Invalid post ID'});
    //         }
    
    //         // Validate if internalUserId is a valid ObjectId before updating the post
    //         if (!mongoose.Types.ObjectId.isValid(internalUserId)) {
    //             return res.status(400).send({"error":'Invalid user ID'});
    //         }
    
    //         let updateQuery = {};
    
    //         if (addLike && !removeLike) {
    //             updateQuery.$addToSet = { user_likes: internalUserId };
    //             return res.status(201).send({"message":'like successfully added'});
    //         } else if (!addLike && removeLike) {
    //             updateQuery.$pull = { user_likes: internalUserId };
    //             return res.status(201).send({"message":'like successfully removed'});
    //         } else {
    //             // If both addLike and removeLike are provided, return a bad request
    //             return res.status(400).send({"error":'Provide either addLike or removeLike, but not both'});
    //         }
    
    //         // Update the post_likes array using $addToSet or $pull based on the options provided
    //         const updatedPost = await Post.findOneAndUpdate(
    //             { _id: postId },
    //             updateQuery,
    //             { new: true } // Return the updated document
    //         );
    
    //         if (!updatedPost) {
    //             return res.status(404).send({"error":'Post not found'});
    //         }
    
    //         res.json(updatedPost);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });
    
    
    router.put('/comment', verifyToken, async (req, res) => {
        try {
            const { postId, internalUserId, comment } = req.body;
    
            console.log('Request Payload:', req.body);
    
            // Validate if postId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({"error":'Invalid post ID format'});
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internalUserId)) {
                return res.status(400).send({"error":'Invalid user ID format'});
            }
    
            console.log('Valid IDs:', postId, internalUserId);
    
            // Check if 'comment' is provided in the request payload
            if (!comment) {
                return res.status(400).send('Comment is required');
            }
    
            // Update the post_comments array with the new comment
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $push: {
                            post_comments: {
                            internalUserId: internalUserId,
                            comment: comment,
                            comment_publication_date_time: new Date(),
                        },
                    },
                },
                { new: true } // Return the updated document
            );
    
            console.log('Updated Post:', updatedPost);
    
            if (!updatedPost) {
                return res.status(404).send('Post not found');
            }
    
            res.json(updatedPost);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    


router.delete('/post/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId)

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
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
    
module.exports = router