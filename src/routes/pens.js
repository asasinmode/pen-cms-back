const express = require("express")
const router = express.Router()

router.get("/", (_, res) => {
   console.log("get pens")
   res.status(200)
   res.json({test: "test"})
})

module.exports = router