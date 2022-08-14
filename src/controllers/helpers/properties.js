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

const updateAssociatedPens = async (propertyName, updatedValues, deletedValues) => {
   console.log("updating pens")
}

export { filterValues, validateValues, createValuesArray, updateAssociatedPens }