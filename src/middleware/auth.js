const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const userModel = require("../database/models/User")

const protect = asyncHandler(async (req, res, next) => {
   let token

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
         token = req.headers.authorization.split(" ")[1]
         const decoded = jwt.verify(token, process.env.JWT_SECRET)

         req.user = await userModel.findById(decoded.id).select('-password')
         if(!req.user){
            throw new Error()
         }

         next()
      } catch(e){
         res.status(401)
         throw new Error("not authorized")
      }
   }

   if(!token){
      res.status(403)
      throw new Error("forbidden")
   }
})

module.exports = { protect }