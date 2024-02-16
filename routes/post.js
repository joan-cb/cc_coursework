const express = require("express")
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require("../verifyToken")
const { postValidation } = require("../validations/validation")
const mongoose = require("mongoose")


router.post('/newPost', verifyToken, async(req,res)=>{
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
            const savedPost = await post.save()
            res.send(savedPost)
        }
        catch(err){
            res.status(400).send({message:error})
        }
    
    
})

router.get("/allPosts", verifyToken, async (req, res) => {
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


    router.get('/post', async (req, res) => {
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
    

    
module.exports = router