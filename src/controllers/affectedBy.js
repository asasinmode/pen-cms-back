const asyncHandler = require("express-async-handler")

const getAffectedByDeletion = asyncHandler(async (req, res) => {
   const properties = req.query.property
   if(!properties){
      res.status(400).send("query parameter \"property\" is required")
      return
   }

   const propertiesArray = properties.split(",")

   const rv = propertiesArray ?
      propertiesArray.reduce((previous, current) => ({
         ...previous,
         [current]: Math.floor(Math.random() * (100 - 0 + 1)) + 0
      }), {})
      : {}

   res.json(rv)
})

const getAffectedByUpdate = asyncHandler((req, res) => {
   const property = req.query.property
   if(!property){
      res.status(400).send("query parameter \"property\" is required")
   }

   const updatedValues = req.query.updated?.split(",")
      .filter(value => value !== "")
   const deletedValues = req.query.deleted?.split(",")
      .filter(value => value !== "")

   const rv = {}

   if(updatedValues && updatedValues.length > 0){
      rv.updated = updatedValues.reduce((previous, current) => ({
         ...previous,
         [current]: Math.floor(Math.random() * (100 - 0 + 1)) + 0
      }), {})
   }
   if(deletedValues && deletedValues.length > 0){
      rv.deleted = deletedValues.reduce((previous, current) => ({
         ...previous,
         [current]: Math.floor(Math.random() * (100 - 0 + 1)) + 0
      }), {})
   }

   res.json(rv)
})

module.exports = { getAffectedByDeletion, getAffectedByUpdate }