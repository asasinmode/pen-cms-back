import express from "express"
import cors from "cors"

const app = express()

import errorHandler from "./middleware/error.js"

// ROUTERS
import indexRouter from "./routes/index.js"
import pensRouter from "./routes/pens.js"
import propertiesRouter from "./routes/properties.js"
import affectedByRouter from "./routes/affectedBy.js"
import usersRouter from "./routes/users.js"

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

export default app
