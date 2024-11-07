const User = require("../model/userModel")
const cloudinary = require("cloudinary").v2
const Notification = require("../model/notificationModel")
const bcrypy = require("bcrypt")
const { use } = require("../routes/authRoutes")
const { json } = require("express")

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

        if(id === req.user._id.toString()) {
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

const getSuggestedUser = async (req , res) => {
    try
    {
        const userId =req.user._id
        const userFollowedByme = await User.findById(userId).select("following")
        
        const users = await User.aggregate([
            {
                $match : {
                    _id: {$ne : userId},
                },
            },
            {$sample : {size : 10}}
        ])
        const filterUsers = users((user) => !userFollowedByme.following.includes(user._id))
        const suggestedUser = filterUsers.slice(0 , 4)
        suggestedUser.forEach((user) => (user.password == null))
        return req.status(200),json({
            suggestedUser
        })

    } catch (error) {
        console.log("error in getSuggestedUser is" , error)
        return res.status(500).json({
            messsage: "Internal Server Error" 
        })
    }
}

const updateUser = async(req , res) => {
    try
    {
        const {username , email , curruntPassword , newPassword , bio , link } = req.body
        let {profileImg , coverImage} = req.body

        const userid = req.user._id
        const user = await User.findById(userid)
        if(!user) {
            return res.status(404),json({
                message: "user not found"
            })    
        } 

        if((!curruntPassword && newPassword) || (!newPassword && curruntPassword)) {
            return res.status(401).json({
                message:"please provide both currunt-password and new-password"
            })
        }
        if(curruntPassword && newPassword) {
            const isMatch = await bcrypy.hash(curruntPassword , user.password)
            if(!isMatch) {
                return res.status(401).json({
                    message: "Currunt password does not match"
                })
            }
            if(newPassword.length < 6) {
                return res.status(401).json({
                    message: "New password must contain more than 6 characters"
                })
            }
            const salt = await bcrypy.genSalt(10)
            const hashnewPassword = await bcrypy.hash(newPassword , salt)
        }
        if(profileImg) {
            if(user.profileImg){
                //it will fetch id of profile from the profile url
                 await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadResponse.secure_url
        }
        if(coverImage) {
            if(user.coverImage) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
            const uploadResponse = await cloudinary.uploader.upload(coverImage)
            coverImage = uploadResponse.secure_url
        }
        user.username = username || user.username,
        user.email = email || user.email,
        user.bio = bio || user.bio,
        user.link = link || user.link,
        user.profileImg = profileImg || user.profileImg,
        user.coverImage = coverImage || user.coverImage

        await user.save();
        user.password = null

        return res.status(200).json({
            message : "User updated",
            data : user
        })
    } catch(error) {
        console.log("error in uploadUser is" , error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports = {
    getUserProfile , getSuggestedUser , followUnfollow , updateUser
}