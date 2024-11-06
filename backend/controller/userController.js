const User = require("../model/userModel")
const cloudinary = require("cloudinary").v2
const Notification = require("../model/notificationModel")

const getUserProfile = async(req , res) => {
    try
    {
        const {username} = req.params
        const user = await User.findOne({username}).select('-password')
        return res.status(200).json({
            user: user
        })
    }
    catch(error) {
        console.log("error in getUserProfile is" , error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
const followUnfollow = async(req , res) => {
    try
    {
        const { id } = req.params
        const userToModify = await User.findById({id})
        const curruntUser = await User.findById(req.user._id)

        if(id === req.user._id) {
            return res.status(401).json({
                message: "you can not follow or unfollow yourself"
            })
        }
        if(!userToModify || !curruntUser) {
            return res.status(404).json({
                message : "user not found"
            })
        }
        const isFollowig = curruntUser.following.includes(id)
        if(isFollowig) {
            //if following do unfollow
            await User.findByIdAndUpdate(id , {$pull:{followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id , {$pull : {following : id}})
        }
        else {
            //if not following do follow
            await User.findByIdAndUpdate(id , {$push : {followers : req.user._id}})
            await User.findByIdAndUpdate(req.user._id , {$push : {following : id}})

            const newNotification = new Notification({
                type: "follow",
                from : req.user._id,
                to : userToModify._id
            })
            await newNotification.save()
            res.status(200).json({
                message: "User followed successfully"
            })
        }
    }
    catch (error) {
        console.log("Error in followUnfollow is" , error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}