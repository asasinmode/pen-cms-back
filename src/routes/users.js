import express from "express"
const router = express.Router()

import { registerUser, loginUser, deleteUser } from "../controllers/users.js"
import { protect } from "../middleware/auth.js"

router.post("/", registerUser)

router.post("/login", loginUser)

router.delete("/:name", protect, deleteUser)

export default router
