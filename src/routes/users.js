const express = require("express")
const router = express.Router()

const { registerUser, loginUser, deleteUser } = require("../controllers/users")

router.post("/", registerUser)

router.post("/login", loginUser)

router.delete("/:name", deleteUser)

module.exports = router