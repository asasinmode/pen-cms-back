import mongoose from "mongoose"

const PenSchema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   properties: {
      type: Object,
      default: {}
   },
   image: String,
})
const PenModel = mongoose.model('Pen', PenSchema)

export default PenModel
