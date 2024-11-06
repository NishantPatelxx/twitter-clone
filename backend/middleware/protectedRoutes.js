const User = require("../model/userModel")
const jwt = require("jsonwebtoken")

 
const protectedRoute = async(req , res , next) => {
    const token = req.cookie.jwt
     if(!token) {
        return res.status(401).json({
            message: "No token provided",
            success: false
        })
     }
     const decoded = await jwt.verify(token , process.env.JWT_SECRET)
     if(!decoded){
        return res.status(401).json({
            message: "Not valid token"
        })
     }
     const user = await User.findById(decoded.userId).select("-password")
     if(!user) {
        return res.status(404).json({
            message: "No user found"
        })
     }
     req.user = user
     next()
}

module.exports = protectedRoute