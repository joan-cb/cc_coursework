const {send} = require("express/lib/response")
const jsonwebtoken = require("jsonwebtoken")


function auth(req,res,next){
    const token = req.header("auth-token")
    if(!token){
        return res.status(401).send("Access denied")
    }
    console.log(token)
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user = verified
        next()

    }catch{
        console.log(verified)
        return res.status(401).send("Invalid token!!")
    }
}


module.exports = auth
