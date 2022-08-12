require("dotenv/config")
const mongoose = require("mongoose")

const uri = process.env.DATABASE_URI;

mongoose.connect(uri, () => {
   console.log("successfully connected to database")
})