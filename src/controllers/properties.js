import { URL } from "url"
import expressAsyncHandler from "express-async-handler"
import PropertyModel from "../database/models/Property.js"
import { filterValues, createValuesArray, validateValues, updateAssociatedPens, deletePropertyFromPens, changePropertyName } from "./helpers/properties.js"

const errorPage = decodeURI(new URL('../assets/error.html', import.meta.url).pathname)
const sacredProperties = ["brand", "ink color"]

const getProperties = expressAsyncHandler(async (_, res) => {
   const properties = await PropertyModel.find().select({ _id: 0, __v: 0 })
   res.json(properties)
})

const createProperty = expressAsyncHandler(async (req, res) => {
   const { name, values } = req.body

   const isNameValid = name && (name.length > 0 && name !== 'new')
   if(!isNameValid){
      res.status(400)
      throw new Error("invalid name")
   }

   const isDuplicateName =  await PropertyModel.exists({ name: name })
   if(isDuplicateName){
      res.status(400)
      throw new Error(`property "${ name }" already exists`)
   }

   console.log("creating new property", name)
   const property = await PropertyModel.create({
      name: name,
      values: values
   })

   res.status(201).json(property)
})

const getProperty = expressAsyncHandler(async (req, res) => {
   const property = await PropertyModel.findOne({ name: req.params.property })
   if(!property){
      res.status(404).sendFile(errorPage)
      return
   }
   res.json(property)
})

const deleteProperty = expressAsyncHandler(async (req, res) => {
   const property = req.params.property
   console.log("deleting property", property)

   if(sacredProperties.includes(property)){
      res.status(400)
      throw new Error(`property "${ property }" cannot be deleted`)
   }

   const deletionResults = await PropertyModel.findOneAndRemove({ name: property })
   if(!deletionResults){
      res.status(404)
      throw new Error("property not found")
   }

   await deletePropertyFromPens(property)

   res.status(204).end()
})

const updateProperty = expressAsyncHandler(async (req, res) => {
   const property = req.params.property
   let newName = req.body.newName

   const currentState = await PropertyModel.findOne({ name: property })
   if(!currentState){
      res.status(404)
      throw new Error("property not found")
   }

   if(newName){
      newName = property === newName ? undefined : newName
   }

   if(newName !== undefined){
      const isNewNameValid = (newName.length > 0 && newName !== 'new')
      if(!isNewNameValid){
         res.status(400)
         throw new Error(`invalid name`)
      }
      const isNewNameTaken = newName !== property && await PropertyModel.exists({ name: newName })
      if(isNewNameTaken){
         res.status(400)
         throw new Error(`property "${ newName }" already exists`)
      }
      const isChangingSacredProperties = sacredProperties.includes(property)
      if(isChangingSacredProperties){
         res.status(400)
         throw new Error(`this property's name cannot be changed`)
      }
   }

   const values = req.body.values || {}

   const isValuesValid = validateValues(values)
   if(!isValuesValid){
      res.status(400)
      throw new Error("invalid values format")
   }

   console.log("patching property", property)

   let { added, updated, deleted } = filterValues(currentState.values, values)

   const updatedValues = createValuesArray(currentState.values, added, updated, deleted)
   const newState = await PropertyModel.findOneAndUpdate({ name: property }, {
      name: newName || property,
      values: updatedValues
   }, { new: true })

   if(deleted.length > 0 || Object.keys(updated).length > 0){
      await updateAssociatedPens(property, updated, deleted)
   }

   if(newName){
      await changePropertyName(property, newName)
      res.set("Content-Location", `properties/${ newName }`)
   }
   res.json(newState)
})

export {
   getProperties,
   createProperty, getProperty, deleteProperty, updateProperty
}