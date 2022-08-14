import expressAsyncHandler from "express-async-handler"
import PenModel from "../database/models/Pen.js"

import { form } from "../middleware/form.js"
import { validateFormData, uploadToCloudinary } from "./helpers/pens.js"

const getPens = expressAsyncHandler(async (req, res) => {
   const properties = await PenModel.find().select({ __v: 0 })
   res.json(properties)
})

const createPen = expressAsyncHandler(async (req, res) => {
   let formData
   try {
      formData = await form(req, res)
   } catch(e){
      throw new Error(e)
   }
   console.log("creating pen")

   const isFormDataValid = validateFormData(formData)
   if(isFormDataValid.length > 0){
      res.status(400)
      throw new Error(isFormDataValid)
   }

   const name = formData.fields.name[0]
   const properties = formData.fields.properties ? JSON.parse(formData.fields.properties[0]) : {}
   const image = formData.files.image ? formData.files.image[0] : undefined

   res.json({"test": "test"})

   const newPen = new PenModel({
      name: name,
      properties: properties
   })
   
   if(image){
      const imageSaveResults = await uploadToCloudinary(image, `${ newPen._id }_v0`).catch(err => {
         throw new Error("error while trying to upload file", err)
      })
      newPen.image = imageSaveResults.secure_url
   }

   const saveResults = await newPen.save()

   res.json(saveResults)
})

const deletePen = expressAsyncHandler(async (req, res) => {
   const pen = req.params.id
   console.log("deleting pen", pen)

   res.status(200).end()
})

export { getPens, createPen, deletePen }
