const mongoose = require("mongoose")
require("dotenv").config()

const dbConnection = async(req , res) => {
    try
    {
        mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("database connected successfully")
        })
    }
    catch(error) {
        console.log("Error in database connection is" , error)
    }
}

module.exports = dbConnection;