const express = require("express")
const router = express.Router()

const { getAffectedByDeletion, getAffectedByUpdate } = require("../controllers/affectedBy")

router.get("/delete", getAffectedByDeletion)

router.get("/update", getAffectedByUpdate)

module.exports = router