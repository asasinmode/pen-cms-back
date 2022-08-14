import express from "express"
const router = express.Router()

import { getPens, createPen, deletePen } from "../controllers/pens.js"

router.route("/").get(getPens)
   .post(createPen)

router.route("/:id").delete(deletePen)

export default router
