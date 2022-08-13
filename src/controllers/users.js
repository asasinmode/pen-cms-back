const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const UserModel = require("../database/models/User")

const registerUser = asyncHandler(async (req, res) => {
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
      name: user.name
   })
})

const deleteUser = asyncHandler(async (req, res) => {
   const { name } = req.params

   if(!name){
      res.status(400)
      throw new Error(`name cannot be empty`)
   }

   const deletionResults = await UserModel.findOneAndRemove({ name })
   if(!deletionResults){
      res.status(404)
      throw new Error("user not found")
   }

   res.status(204).end()
})

const loginUser = asyncHandler(async (req, res) => {
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

module.exports = { registerUser, deleteUser, loginUser }