const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    post_title: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    post_owner: {
        type: String,
        required: true,
        min: 3,
        max: 2560
    },
    post_description: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    post_publication_date_time: {
        type: Date,
        default: Date.now()
    },
    post_comments: [],
    user_likes: [],
});

module.exports = mongoose.model("Post", postSchema);
