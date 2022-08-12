const path = require("path")
const express = require("express")
const router = express.Router()

const PropertyModel = require("../database/models/Property")
const errorPage = path.join(__dirname, '../assets/error.html')

const { filterValues, createValuesArray, validateValues, updateAssociatedPens } = require("./helpers/propertiesHelpers")

router.get("/", async (_, res) => {
   const properties = await PropertyModel.find().select({ _id: 0, __v: 0 })
   res.json(properties)
})

router.post("/", async (req, res) => {
   const name = req.body.name
   const values = req.body.values

   const isNameValid = name && name.length > 0
   if(!isNameValid){
      res.status(400).send(`name cannot be empty`)
   }

   const isDuplicateName = await PropertyModel.exists({ name: name })
   if(isDuplicateName){
      res.status(400).send(`property "${ name }" already exists`)
      return
   }

   console.log("creating new property", name)
   const property = new PropertyModel({
      name: name,
      values: values
   })

   const saveResults = await property.save()
   res.status(201).json(saveResults)
})

router.get("/:property", async (req, res) => {
   const property = await PropertyModel.findOne({ name: req.params.property })
   if(!property){
      res.status(404).sendFile(errorPage)
      return
   }
   res.json(property)
})

router.delete("/:property", async (req, res) => {
   const property = req.params.property

   if(["brand", "ink color"].includes(property)){
      res.status(400).send("this property cannot be deleted")
      return
   }

   console.log("deleting property", property)

   const deletionResults = await PropertyModel.findOneAndRemove({ name: property })
   if(!deletionResults){
      res.status(404).end()
      return
   }

   res.status(204).end()
})

router.patch("/:property", async (req, res) => {
   const property = req.params.property
   let newName = req.body.newName

   const currentState = await PropertyModel.findOne({ name: property })
   if(!currentState){
      res.status(404).end()
      return
   }

   if(newName){
      newName = property === newName ? undefined : newName
   }

   if(newName !== undefined){
      const isNewNameValid = newName.length > 0
      if(!isNewNameValid){
         res.status(400).send(`name cannot be empty`)
         return
      }
      const isNewNameTaken = newName !== property && await PropertyModel.exists({ name: newName })
      if(isNewNameTaken){
         res.status(400).send(`property "${ newName }" already exists`)
         return
      }
   }

   const isValuesValid = validateValues(req.body.values.added, req.body.values.updated, req.body.values.deleted)
   if(!isValuesValid){
      res.status(400).send("invalid values format")
      return
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

module.exports = router