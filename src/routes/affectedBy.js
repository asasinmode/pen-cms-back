import express from "express"
const router = express.Router()

import { getAffectedByDeletion, getAffectedByUpdate } from "../controllers/affectedBy.js"

router.get("/delete", getAffectedByDeletion)

router.get("/update", getAffectedByUpdate)

export default router
