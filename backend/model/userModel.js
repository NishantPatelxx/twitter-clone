const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default : []
        }
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg : {
        type: String,
        default : ""
    },
    coverImage: {
        type: String,
        default : ""
    },
    bio : {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default : ""
    },
    likedPosts : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Posts",
            default: []
        }
    ]

}, {timestamps : true})

module.exports = mongoose.model("Users" , userSchema)