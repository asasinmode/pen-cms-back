const mongoose = require("mongoose")

const PenSchema = mongoose.Schema({
   name: {
      type: String,
      required: true,
      index: true,
      unique: true
   },
   properties: {
      type: Object,
      default: {}
   }
})
const PenModel = mongoose.model('Pen', PenSchema)

module.exports = PenModel