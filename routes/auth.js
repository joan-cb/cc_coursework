const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { register_validation, login_validation } = require("../validations/validation");
const bcryptjs = require("bcryptjs")
const json_web_token = require("jsonwebtoken")
const verify_token = require("../verifytoken")

router.post('/registration', async(req,res)=>{
    const {error} = register_validation(req.body)
    if(error){
    return res.status(404).send({message:error["details"][0]["message"]})
    }
    const user_exists = await User.findOne({email:req.body.email})
        if(user_exists){
            return res.status(400).send({message:"user already exists"})
        }
        const salt = await bcryptjs.genSalt(5)
        const hashed_password  = await bcryptjs.hash(req.body.password,salt)

        
        const user = new User({
            user_name:req.body.user_name,
            email:req.body.email,
            password:hashed_password

        })
        try{
            const saved_user = await user.save()
            res.send({"message":"new user created"})
        }
        catch{
            res.status(400).send({message:"unexpected error"})
        }
    
    
})


router.post('/login', async (req, res) => {
    try {
        const { error } = login_validation(req.body);
        if (error) {
            console.log(true)
            return res.send({ message: error.details[0].message });
        }
        console.log(false)
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        const password_validation = await bcryptjs.compare(req.body.password, user.password);
        if (!password_validation) {
            return res.status(401).send({ message: 'Incorrect password' });
        }

        const token_expiration = 60 * 60;

        const token = json_web_token.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: token_expiration,
        });

        // Include the internal _id of the user in the response
        res.header('auth-token', token).send({ 'auth-token': token, internal_user_id: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.delete('/users', verify_token, async (req, res) => {
    try {
        // Delete all posts
        const deleted_users = await User.deleteMany({});

        if (deleted_users.deleted_count === 0) {
            return res.status(404).send('No posts found to delete');
        }

        res.status(200).json({ message: 'All posts deleted successfully', deleted_users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;



