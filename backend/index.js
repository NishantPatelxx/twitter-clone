const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
const dbConnection = require("./config/dbConnection")

app.use(express.json())
app.use(cors ())


const PORT = process.env.PORT
dbConnection()
app.listen(PORT , () => {
    console.log("Server Started On Port" , PORT)
})