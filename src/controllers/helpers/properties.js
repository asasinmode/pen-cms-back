import PenModel from "../../database/models/Pen.js"

const filterValues = (currentValues, { added, updated, deleted }) => {
   added = added ?
      added.filter(value => !currentValues.includes(value)) // filter already existing
      : []

   deleted = deleted ?
      deleted.filter(value => currentValues.includes(value))   // filter out non-existant values
      : []

   updated = updated ?
      Object.keys(updated)?.filter(oldValue => {         // move empty values to deleted
         if(updated[oldValue] !== ""){ return true }
         deleted.push(updated[oldValue])
         return false
      })
         .filter(value => currentValues.includes(value)) // filter out non-existant values
         .filter(value => !deleted.includes(value))      // filter out the ones being deleted
         .filter(value => value !== updated[value])      // filter out unchanged
         .reduce((previous, current) => ({               // build an object of oldname: newname
            ...previous,
            [current]: updated[current]
         }), {})
      : {}

   return {
      added, updated, deleted
   }
}

const validateValues = ({ added, updated, deleted }) => {
   const isAddedValid = added === undefined || Array.isArray(added)
   const isUpdatedValid = updated === undefined || typeof updated === 'object'
   const isDeletedValid = deleted === undefined || Array.isArray(deleted)

   return isAddedValid && isUpdatedValid && isDeletedValid
}

const createValuesArray = (currentValues, added, updated, deleted) => {
   let rv = currentValues.filter(value => !deleted.includes(value))  // filter out deleted ones
      .filter(value => !Object.keys(updated).includes(value))        // filter out updated ones

   rv.push(...added)                   // push new ones
   rv.push(...Object.values(updated))  // push updated values

   return rv.sort()
}

const deletePropertyFromPens = async (property) => {
   console.log("deleting property from pens")
   const propertyPath = `properties.${ property }`

   return PenModel.updateMany({ [propertyPath]: { $exists: true } }, {
      $unset: { [propertyPath]: 1 }
   })
}

const updateAssociatedPens = (propertyName, updatedValues, deletedValues) => {
   let rv = []
   const propertyPath = `properties.${ propertyName }`

   Object.keys(updatedValues).forEach(oldValue => {
      const newValue = updatedValues[oldValue]
      rv.push(PenModel.updateMany({
         [propertyPath]: oldValue
      }, {
         [propertyPath]: newValue
      }))
   })

   rv.push(deletedValues.map(value => {
      return PenModel.updateMany({
         [propertyPath]: value
      }, {
         $unset: { [propertyPath]: 1 }
      })
   }))

   return Promise.all(rv)
}

const changePropertyName = (property, newName) => {
   const propertyPath = `properties.${ property }`
   const newPath = `properties.${ newName }`

   return PenModel.updateMany({}, {
      $rename: { [propertyPath]: newPath }
   })
}

export { filterValues, validateValues, createValuesArray, deletePropertyFromPens, updateAssociatedPens, changePropertyName }