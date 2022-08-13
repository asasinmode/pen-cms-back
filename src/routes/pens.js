import express from "express"
const router = express.Router()

import { getPens, createPen } from "../controllers/pens.js"

router.route("/").get(getPens)
   .post(createPen)

export default router
