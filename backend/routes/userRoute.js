const express = require('express')
const router = express.Router()
const {getUserProfile , followUnfollow , getSuggestedUser , updateUser} = require("../controller/userController")
const protectedRoute = require("../middleware/protectedRoutes")

router.get("/profile/:username" , protectedRoute , getUserProfile)
router.get("/suggested" , protectedRoute , getSuggestedUser)
router.post("/follow/:id" , protectedRoute , followUnfollow)
router.post("/update/:id" , protectedRoute , updateUser)

module.exports = router