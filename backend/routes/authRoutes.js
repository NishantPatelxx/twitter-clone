const express = require("express")
const router = express.Router()
const {signup , login , getMe , logout} = require('../controller/authController')
const protectedRoute = require("../middleware/protectedRoutes")

router.post("/signup" , signup)
router.post("/login" , login)
router.post("/logout" , logout)
router.post("/me" , protectedRoute , getMe)

module.exports = router