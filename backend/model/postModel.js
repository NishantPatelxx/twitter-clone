const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    users : {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true 
    },
    text: {
        type : String,
    },
    image: {
        type : String
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Types.ObjectId,
                ref: "Users",
                required: true
            }
        }
    ]


}, {timestamps: true})

module.exports = mongoose.model("Posts" , postSchema)