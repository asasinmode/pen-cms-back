const express = require("express");
const app = express()

// ROUTERS
const indexRouter = require("./routes/index")
const pensRouter = require("./routes/pens")

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"))

// ROUTES
app.use("/", indexRouter)
app.use("/pens", pensRouter)

module.exports = app