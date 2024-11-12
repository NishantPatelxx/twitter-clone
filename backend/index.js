const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const app = express()
const dbConnection = require("./config/dbConnection")
const userRoutes = require("./routes/userRoute")
const postRoutes = require("./routes/postsRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
})

app.use(express.json())
app.use(cors ())


const PORT = process.env.PORT
dbConnection()
app.use("/auth" , authRoutes)
app.use("/user" , userRoutes)
app.use("/post",  postRoutes)
app.use("/notifications" , notificationRoutes)
app.listen(PORT , () => {
    console.log("Server Started On Port" , PORT)
})