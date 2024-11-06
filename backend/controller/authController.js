const { generateTokenAndSetCookie } = require("../utils/generateToken")
const User = require("../model/userModel")
const bcrypt = require("bcrypt")

const signup = async(req , res) => {
    try
    {
        const {username , email , password } = req.body
        if(!username || !email || !password ) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Invalid Email",
                success: false
            })
        }
        const existingUser = await User.findOne({username}) || await User.findOne({email}) 
        if(existingUser) {
            return res.status(401).json({
                message: "Usernamr Or Email is already in use"
            })
        }
        if(password.length < 6) {
            return res.status(401).json({
                message: "password must include more than 6 character",
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password , salt)

        const newUser = new User({
            username,
            password:hashPassword,
            email
        })
        if(newUser) {
            generateTokenAndSetCookie(newUser._id , res);
            await newUser.save()
            return res.status(201).json({
                message: "user created successfully",
                success: true,
                data: newUser
            })
        }``
    }
    catch(error) 
    {
        console.log("error in signup is", error)
        return res.status(500).json({
            message : "Internal Server Error",
            success: false
        })
    }
}

const login = async(req , res) => {
    try
    {
        const {username , password} = req.body
        if(!username || !password) {
            return res.status(401).json({
                message: "please enter username and password",
                success: false 
            })
        }
        const findUser = await User.findOne({username})
        if(!findUser){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        const validPassword = await bcrypt.compare(password , findUser.password)
        if(!validPassword) {
            return res.status(402).json({
                message: "Password is incorrect",
                success: false
            })
        }
        generateTokenAndSetCookie(findUser._id , res)
        return res.status(200).json({
            message: "User loggedin successfully",
            success: true,
            data: findUser
        })
    }
    catch(error) {
        console.log("error in login" , error)
        return res.status(500).json({
            message : "Internal Server Error",
            success: false
        })
    }
}
const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getMe = async (req , res) => {
    try
    {
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json({
            user: user
        })
    }catch(error) {
        console.log("Error in getME controller is" , error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
module.exports = {
    signup,
    login,
    logout,
    getMe
}