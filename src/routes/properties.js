import express from "express"
const router = express.Router()

import { getProperties, createProperty, getProperty, deleteProperty, updateProperty } from "../controllers/properties.js"
import { protect } from "../middleware/auth.js"

router.route('/').get(getProperties)
   .post(protect, createProperty)

router.route('/:property').get(getProperty)
   .delete(protect, deleteProperty)
   .patch(protect, updateProperty)

export default router
