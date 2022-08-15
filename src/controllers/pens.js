import expressAsyncHandler from "express-async-handler"
import PenModel from "../database/models/Pen.js"

import { form } from "../middleware/form.js"
import { validateFormData, uploadToCloudinary, deleteFromCloudinary } from "./helpers/pens.js"

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

   const isFormDataValid = validateFormData(formData)
   if(isFormDataValid.length > 0){
      res.status(400)
      throw new Error(isFormDataValid)
   }

   console.log("creating pen")

   const name = formData.fields.name[0]
   const properties = formData.fields.properties ? JSON.parse(formData.fields.properties[0]) : {}
   const image = formData.files.image ? formData.files.image[0] : undefined

   const newPen = new PenModel({
      name: name,
      properties: properties
   })

   if(image){
      const imageSaveResults = await uploadToCloudinary(image).catch(err => {
         res.status(500)
         throw new Error("error while uploading image", err)
      })
      newPen.image = imageSaveResults.secure_url
   }

   const saveResults = await newPen.save()

   res.json(saveResults)
})

const getPen = expressAsyncHandler(async (req, res) => {
   const pen = await PenModel.findOne({ _id: req.params.id })
   if(!pen){
      res.status(404).sendFile(errorPage)
      return
   }
   res.json(pen)
})

const deletePen = expressAsyncHandler(async (req, res) => {
   const id = req.params.id

   const deletionResults = await PenModel.findByIdAndRemove(id)
   if(!deletionResults){
      res.status(404)
      throw new Error("pen not found")
   }

   console.log("deleting pen", id)
   
   const hadImage = deletionResults.image !== undefined
   if(hadImage){
      deleteFromCloudinary(deletionResults.image).catch(err => {       // not awaiting so response is faster
         console.error("error while deleting image", deletionResults.image, err)
      })
   }

   res.status(204).end()
})

const updatePen = expressAsyncHandler(async (req, res) => {
   const id = req.params.id

   const currentState = await PenModel.findById(id)
   if(!currentState){
      res.status(404)
      throw new Error("pen not found")
   }

   let formData
   try {
      formData = await form(req, res)
   } catch(e){
      throw new Error(e)
   }

   const isFormDataValid = validateFormData(formData, true)
   if(isFormDataValid.length > 0){
      res.status(400)
      throw new Error(isFormDataValid)
   }

   console.log("updating pen", id)

   const name = formData.fields.name ? formData.fields.name[0] : undefined
   const properties = formData.fields.properties ? JSON.parse(formData.fields.properties[0]) : undefined
   const image = formData.files.image ? formData.files.image[0] : undefined

   const updateObject = {}
   if(name){
      updateObject.name = name
   }
   if(properties){
      updateObject.properties = properties
   }
   if(image){
      const hadImage = currentState.image !== undefined
      hadImage && deleteFromCloudinary(currentState.image).catch(err => {  // not awaiting so response is faster
         console.error("error while deleting image", currentState.image, err)
      })

      const imageSaveResults = await uploadToCloudinary(image).catch(err => {
         res.status(500)
         throw new Error("error while uploading image", err)
      })

      updateObject.image = imageSaveResults.secure_url
   }

   const newState = await PenModel.findOneAndUpdate({ _id: id }, updateObject, { new: true })

   res.json(newState)
})

export { getPens, createPen, getPen, deletePen, updatePen }
