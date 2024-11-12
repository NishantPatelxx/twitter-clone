const Notification = require('../model/notificationModel')


const sendNotification = async (req , res) => {
    try
    {
        const userId =req.user._id
        const notifications = await Notification.find({to : userId})
        .populate({
            path: "from",
            select : "username profileImg"
        })
        await Notification.updateMany({ to: userId }, { read: true });
        return res.status(200).json({
            data : notifications
        })
    }catch (error) {
        console.log("error in sendNotification is" , error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

const deleteNotification = async (req , res) => {
    try
    {
        const userId = req.user._id
        await Notification.deleteMany({to : userId})
        return res.status(200).json({
            message : "notifications deleted successfully"
        })
    }catch(error) {
        console.log("Error in deleteNotification is" ,error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

module.exports = {sendNotification , deleteNotification}