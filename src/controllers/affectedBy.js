import expressAsyncHandler from "express-async-handler"
import PenModel from "../database/models/Pen.js"

const affectedByDeletionNumber = (path) => {
   return PenModel.countDocuments({
      [path]: { $exists: true }
   })
}

const getAffectedByDeletion = expressAsyncHandler(async (req, res) => {
   const properties = req.query.property
   if(!properties){
      res.status(400).send("query parameter \"property\" is required")
      return
   }

   const propertiesArray = properties.split(",")

   const rv = propertiesArray ?
      await propertiesArray.reduce(async (previous, current) => {
         const propertyPath = `properties.${ current }`
         return {
            ...previous,
            [current]: await affectedByDeletionNumber(propertyPath)
         }
      }, {})
      : {}

   res.json(rv)
})

const getAffectedByUpdate = expressAsyncHandler(async (req, res) => {
   const property = req.query.property
   if(!property){
      res.status(400).send("query parameter \"property\" is required")
   }

   const updatedValues = req.query.updated?.split(",")
      .filter(value => value !== "")
   const deletedValues = req.query.deleted?.split(",")
      .filter(value => value !== "")

   const rv = {}

   const propertyPath = `properties.${ property }`
   const pensWithProperty = await PenModel.find({
      [propertyPath]: { $exists: true }
   }).select({ properties: 1, _id: 0 })

   if(updatedValues && updatedValues.length > 0){
      rv.updated = updatedValues.reduce((previous, current) => {
         return {
            ...previous,
            [current]: pensWithProperty.filter(pen => pen.properties[property] === current).length
         }
      }, {})
   }
   if(deletedValues && deletedValues.length > 0){
      rv.deleted = deletedValues.reduce((previous, current) => {
         return {
            ...previous,
            [current]: pensWithProperty.filter(pen => pen.properties[property] === current).length
         }
      }, {})
   }

   res.json(rv)
})

export { getAffectedByDeletion, getAffectedByUpdate }