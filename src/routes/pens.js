import express from "express"
const router = express.Router()

import { getPens, createPen, getPen, deletePen, updatePen } from "../controllers/pens.js"

router.route("/").get(getPens)
   .post(createPen)

router.route("/:id").get(getPen)
   .delete(deletePen)
   .patch(updatePen)


export default router
