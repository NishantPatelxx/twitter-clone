const Notification = require("../model/notificationModel")
const Post = require("../model/postModel")
const cloudinary = require("cloudinary").v2
const User = require("../model/userModel")

const createPost = async (req , res) => {
    try
    {
        const { text } = req.body
        const { image } = req.body
        const userId = req.user._id.toString()
        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        if(!text || !image) {
            return res.status(401).json({
                message: "Image and text both are required"
            })
        }
        if(image) {
            const uplosdResponse = await cloudinary.uploader.upload(image)
            image = uplosdResponse.secure_url
        }
        const newPost = new Post({
            users : userId,
            text,
            image
        })
        await newPost.save()
        return res.status(200).json({
            message : "Post created succesfully",
            post : newPost
        })

    }catch(error){
        console.log("error in createPost is" , error)
        return res.status(500).json({
            message: "internal Server Error"
        })
    }
}

const deletePost = async (req , res) => {
    try
    {
        const post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({
                message: "Post not Found"
            })
        }
        if(post.users._id !== req.user._id){
            return res.status(401).json({
                message : "You are not authorized to delete this post"
            })
        }
        if(post.image) {
          const imgId =  post.image.split("/").pop().split(".")[0]
          await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            message : "Post deleted Successfully"
        })
    }
    catch(error) {
        console.log("Error in deletePost is" , error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


const commentOnPost = async (req , res) => {
    try
    {
        const postId = req.params.id
        const userId = req.user._id
        const { text } = req.body

        if(!text) {
            return res.status(401).json({
                message : "Text feild is required"
            })
        }
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(404).json({
                message : "No post found"
            })
        }
        const comment = {user : userId , text}
        post.comments.push(comment)
        await post.save()

        return res.status(200).json({
            message : "commet done successfully",
            comment: comment
        })
    }catch(error) {
        console.log("Error in commentOnPost is" , error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

