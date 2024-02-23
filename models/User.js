const mongoose = require("mongoose")
const user_schema = mongoose.Schema({
    user_name:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:3,
        max:2560
    },
    email:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    date:{
        type:Date,
        default:Date.now
    }
    }
)

module.exports = mongoose.model("users",user_schema)
