const express = require("express");
const cors = require("cors")
const app = express()

// ROUTERS
const indexRouter = require("./routes/index")
const pensRouter = require("./routes/pens")
const propertiesRouter = require("./routes/properties")
const affectedByRouter = require("./routes/affectedBy")

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

// ERROR
app.use((err, req, res, next) => {
   console.error(err)
   if(res.headersSent){
      return next(err)
   }
   res.status(500).send("an unknown error has occurred")
})

module.exports = app
