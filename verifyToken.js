const { send } = require("express/lib/response");
const jsonwebtoken = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("Access denied");
    }
    console.log(token);
    let verified; // Declare the variable outside the try block

    try {
        verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send("Invalid token!!");
    }
}

module.exports = auth;
