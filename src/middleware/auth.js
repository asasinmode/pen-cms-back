import jwt from "jsonwebtoken"
import expressAsyncHandler from "express-async-handler"
import userModel from "../database/models/User.js"

const protect = expressAsyncHandler(async (req, res, next) => {
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

export { protect }
