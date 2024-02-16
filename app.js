const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const filmRoute = require("./routes/films");
const authRoute = require("./routes/auth");
require("dotenv/config");


console.log("app starting...");
app.use(bodyParser.json())
app.use("/api/film", filmRoute);
app.use("/api/user", authRoute);

mongoose.connect(process.env.DB_CONNECTOR)
    .then(() => {
        console.log("DB connected...");
        app.listen(3000, () => {
            console.log("Server is running...");
        });
    })
    .catch(err => console.error("Error connecting to the database:", err));

    //left at 37min
