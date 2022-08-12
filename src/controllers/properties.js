const path = require("path")
const asyncHandler = require("express-async-handler")
const PropertyModel = require("../database/models/Property")
const { filterValues, createValuesArray, validateValues, updateAssociatedPens } = require("./helpers/propertiesHelpers")

const errorPage = path.join(__dirname, '../assets/error.html')

const getProperties = asyncHandler(async (_, res) => {
   const properties = await PropertyModel.find().select({ _id: 0, __v: 0 })
   res.json(properties)
})

const setProperty = asyncHandler(async (req, res) => {
   const name = req.body.name
   const values = req.body.values

   const isNameValid = name && name.length > 0
   if(!isNameValid){
      res.status(400)
      throw new Error("name cannot be empty")
   }

   const isDuplicateName = await PropertyModel.exists({ name: name })
   if(isDuplicateName){
      res.status(400)
      throw new Error(`property "${ name }" already exists`)
   }

   console.log("creating new property", name)
   const property = new PropertyModel({
      name: name,
      values: values
   })

   const saveResults = await property.save()
   res.status(201).json(saveResults)
})

const getProperty = asyncHandler(async (req, res) => {
   const property = await PropertyModel.findOne({ name: req.params.property })
   if(!property){
      res.status(404).sendFile(errorPage)
      return
   }
   res.json(property)
})

const deleteProperty = asyncHandler(async (req, res) => {
   const property = req.params.property

   if(["brand", "ink color"].includes(property)){
      res.status(400)
      throw new Error(`property "${ property }" cannot be deleted`)
   }

   console.log("deleting property", property)

   const deletionResults = await PropertyModel.findOneAndRemove({ name: property })
   if(!deletionResults){
      res.status(404)
      throw new Error("property not found")
   }

   res.status(204).end()
})

const updateProperty = asyncHandler(async (req, res) => {
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
      const isNewNameValid = newName.length > 0
      if(!isNewNameValid){
         res.status(400)
         throw new Error(`name cannot be empty`)
      }
      const isNewNameTaken = newName !== property && await PropertyModel.exists({ name: newName })
      if(isNewNameTaken){
         res.status(400)
         throw new Error(`property "${ newName }" already exists`)
      }
   }

   const isValuesValid = validateValues(req.body.values.added, req.body.values.updated, req.body.values.deleted)
   if(!isValuesValid){
      res.status(400)
      throw new Error("invalid values format")
   }

   console.log("patching property", property)

   let { added, updated, deleted } = filterValues(currentState.values, req.body.values.added, req.body.values.updated, req.body.values.deleted)

   const updatedValues = createValuesArray(currentState.values, added, updated, deleted)
   const newState = await PropertyModel.findOneAndUpdate({ name: property }, {
      name: newName || property,
      values: updatedValues
   }, { new: true })

   if(deleted.length > 0 || Object.keys(updated).length > 0){
      console.log("updating associated pens")
      await updateAssociatedPens(property, updated, deleted)
   }

   if(newName){
      res.set("Content-Location", `properties/${ newName }`)
   }
   res.json(newState)
})

module.exports = {
   getProperties,
   setProperty, getProperty, deleteProperty, updateProperty
}