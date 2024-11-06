const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true
    },
    to : {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true
    },
    type : {
        type: String,
        requred: true,
        enum : ["follow" , "like"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps : true})

module.exports = mongoose.model("Notifications" , notificationSchema)