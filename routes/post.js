const express = require("express")
const router = express.Router()
const Post = require('../models/Post')
const verifyToken = require("../verifyToken")
const { postValidation } = require("../validations/validation")


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


router.get("/allPosts", verifyToken, async(req,res)=>{
        try{
        const posts = await Post.find();
        res.send(posts);
        }catch(err){
            res.status(400).send({message:err});
        }
    })




module.exports = router