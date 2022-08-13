const express = require("express");
const cors = require("cors")
const app = express()

const errorHandler = require("./middleware/errror")

// ROUTERS
const indexRouter = require("./routes/index")
const pensRouter = require("./routes/pens")
const propertiesRouter = require("./routes/properties")
const affectedByRouter = require("./routes/affectedBy")
const usersRouter = require("./routes/users")

// MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"))

// ROUTES
app.use("/", indexRouter)
app.use("/pens", pensRouter)
app.use("/properties", propertiesRouter)
app.use("/affectedBy", affectedByRouter)
app.use("/users", usersRouter)

// ERROR
app.use(errorHandler)

module.exports = app
