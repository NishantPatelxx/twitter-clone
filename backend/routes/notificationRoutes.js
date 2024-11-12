const express = require('express')
const router = express.Router()
const protectedRoute = require("../middleware/protectedRoutes")
const {sendNotification , deleteNotification} = require('../controller/notificationController')

router.get("/" , protectedRoute , sendNotification)
router.delete("/" , protectedRoute , deleteNotification)

module.exports = router 
