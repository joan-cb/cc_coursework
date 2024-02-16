const express = require("express")
const router = express.Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require("../validations/validation");
const bcryptjs = require("bcryptjs")
const jsonwebtoken = require("jsonwebtoken")

router.post('/register', async(req,res)=>{
    const {error} = registerValidation(req.body)
    if(error){
    return res.send({message:error["details"][0]["message"]})
    }
    const userExists = await User.findOne({email:req.body.email})
        if(userExists){
            return res.status(400).send({message:"user already exists"})
        }
        const salt = await bcryptjs.genSalt(5)
        const hashedPassword  = await bcryptjs.hash(req.body.password,salt)

        
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword

        })
        try{
            const savedUser = await user.save()
            res.send(savedUser)
        }
        catch{
            res.status(400).send({message:error})
        }
    
    
})


router.post('/login', async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const passwordValidation = await bcryptjs.compare(req.body.password, user.password);
        if (!passwordValidation) {
            return res.status(400).send({ message: 'Incorrect password' });
        }

        const tokenExpiration = 60 * 60;

        const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: tokenExpiration,
        });

        // Include the internal _id of the user in the response
        res.header('auth-token', token).send({ 'auth-token': token, internalUserId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});



module.exports = router
