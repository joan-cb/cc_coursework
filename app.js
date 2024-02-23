const express = require("express");
const app = express();
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const auth_route = require("./routes/auth");
const post_route = require("./routes/post");
require("dotenv/config");


console.log("App is starting...");
app.use(body_parser.json());
app.use("/user_management", auth_route);
app.use("/post_management", post_route);

mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => {
        console.log("DB is connected...");
        app.listen(3000, () => {
            console.log("Server is running...");
        });
    })
    .catch(err => console.error("Error connecting to the database:", err));
