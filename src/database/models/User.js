import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
   name: {
      type: String,
      required: true,
      index: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
   }
})
const UserModel = mongoose.model('User', UserSchema)

export default UserModel