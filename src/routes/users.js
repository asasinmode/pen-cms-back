const express = require("express")
const router = express.Router()

const { registerUser, loginUser, deleteUser } = require("../controllers/users")
const { protect } = require("../middleware/auth")

router.post("/", registerUser)

router.post("/login", loginUser)

router.delete("/:name", protect, deleteUser)

module.exports = router