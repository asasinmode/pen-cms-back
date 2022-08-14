import express from "express"
const router = express.Router()

import { getPens, createPen, getPen, deletePen, updatePen } from "../controllers/pens.js"
import { protect } from "../middleware/auth.js"

router.route("/").get(getPens)
   .post(protect, createPen)

router.route("/:id").get(getPen)
   .delete(protect, deletePen)
   .patch(updatePen)

export default router
