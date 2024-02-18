const express = require("express")
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require("../verifyToken")
const { postValidation } = require("../validations/validation")
const mongoose = require("mongoose")


router.post('/post', verifyToken, async(req,res)=>{
    const {error} = postValidation(req.body)
    if(error){        console.log(error)
    return res.send({message:error["details"][0]["message"]})
    }
    console.log(req.body)
    const post = new Post({
        post_title:req.body.post_title,
        post_owner:req.body.post_owner,
        post_description:req.body.post_description,
        })   
        try{
            console.log("try")
            const savedPost = await post.save();
            res.status(201).send(savedPost);
        }
        catch(err){
            res.status(400).send({message:error})
        }
    
    
})


router.get("/posts", verifyToken, async (req, res) => {
    try {
        const postsWithInternalId = (await Post.find()).map(post => ({
            ...post._doc,
            internalId: post._id,
        }));

        res.send(postsWithInternalId);
    } catch (err) {
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
                return res.status(400).send('Invalid post ID');
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internalUserId)) {
                return res.status(400).send('Invalid user ID');
            }
    
            let updateQuery = {};
    
            if (addLike) {
                updateQuery.$addToSet = { user_likes: internalUserId };
            }
    
            if (removeLike) {
                updateQuery.$pull = { user_likes: internalUserId };
            }
    
            // If neither addLike nor removeLike is provided, return a bad request
            if (!addLike && !removeLike) {
                return res.status(400).send('Either addLike or removeLike must be provided');
            }
    
            // Update the post_likes array using $addToSet or $pull based on the options provided
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId },
                updateQuery,
                { new: true } // Return the updated document
            );
    
            if (!updatedPost) {
                return res.status(404).send('Post not found');
            }
    
            res.json(updatedPost);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    
    
    router.put('/comment', verifyToken, async (req, res) => {
        try {
            const { postId, internalUserId, comment } = req.body;
    
            console.log('Request Payload:', req.body);
    
            // Validate if postId is a valid ObjectId before querying the database
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send('Invalid post ID format');
            }
    
            // Validate if internalUserId is a valid ObjectId before updating the post
            if (!mongoose.Types.ObjectId.isValid(internalUserId)) {
                return res.status(400).send('Invalid user ID format');
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
    
module.exports = router;