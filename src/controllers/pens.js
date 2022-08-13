import formidable from "formidable"
import expressAsyncHandler from "express-async-handler"
import PenModel from "../database/models/Pen.js"

const getPens = expressAsyncHandler(async (req, res) => {
   console.log("getting pens")

   res.status(200)
   res.end()
})

const createPen = expressAsyncHandler(async (req, res) => {
   console.log("creating pen")
   console.log(req.headers)

   const form = formidable()

   res.status(200)
   res.end()
})

export { getPens, createPen }
