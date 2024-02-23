const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    password: {
        type: String,
        required: true,
        min: 3,
        max: 2560
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("users", userSchema);
