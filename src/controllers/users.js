import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import expressAsyncHandler from "express-async-handler"
import UserModel from "../database/models/User.js"

const registerUser = expressAsyncHandler(async (req, res) => {
   const { name, password } = req.body

   if(!name || !password){
      res.status(400)
      throw new Error("name and password are required")
   }

   const isUsernameTaken = await UserModel.exists({ name })
   if(isUsernameTaken){
      res.status(400)
      throw new Error(`username ${ name } is taken`)
   }

   console.log("creating user")

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt)

   const user = await UserModel.create({
      name,
      password: hashedPassword
   })

   if(!user){
      res.status(400)
      throw new Error("Invalid user data")
   }

   res.status(201).json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id)
   })
})

const deleteUser = expressAsyncHandler(async (req, res) => {
   const { name } = req.params

   const user = await UserModel.findById(req.user._id)

   if(!user || user.name !== name){
      res.status(403)
      throw new Error("not authorized")
   }

   console.log("deleting user", user.name)

   const deletionResults = await UserModel.findOneAndRemove({ name })
   if(!deletionResults){
      res.status(404)
      throw new Error("user not found")
   }

   res.status(204).end()
})

const loginUser = expressAsyncHandler(async (req, res) => {
   const { name, password } = req.body

   const user = await UserModel.findOne({ name })

   if(user && (await bcrypt.compare(password, user.password))){
      res.json({
         _id: user._id,
         name: user.name,
         token: generateToken(user._id)
      })
      return
   }

   res.status(400)
   throw new Error("invalid credentials")
})

const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
   })
}

export { registerUser, deleteUser, loginUser }