import expressAsyncHandler from "express-async-handler"
import PenModel from "../database/models/Pen.js"
import { form } from "../middleware/form.js"

const getPens = expressAsyncHandler(async (req, res) => {
   console.log("getting pens")

   res.status(200)
   res.end()
})

const createPen = expressAsyncHandler(async (req, res) => {
   console.log("creating pen")
   let formData
   try {
      formData = await form(req)
   } catch(e){
      console.error(e)
      res.status(400)
      throw new Error("invalid form data")
   }

   const name = formData.fields.name[0] || ""
   const properties = JSON.parse(formData.fields.properties[0]) || {}
   const image = formData.files.image || undefined

   console.log("new pen", name, properties, image)

   res.status(200)
   res.end()
})

export { getPens, createPen }
