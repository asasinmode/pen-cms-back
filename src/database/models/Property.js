import mongoose from "mongoose"

const PropertySchema = mongoose.Schema({
   name: {
      type: String,
      required: true,
      index: true,
      unique: true
   },
   values: {
      type: [String],
      default: []
   }
})
const PropertyModel = mongoose.model('Property', PropertySchema)

export default PropertyModel