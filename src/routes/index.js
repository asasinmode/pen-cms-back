const express = require("express")
const path = require("path")
const router = express.Router()

router.get("/", (_req, res, _next) => {
   const indexPath = path.join(__dirname, '../assets/index.html')

   res.set("Content-Type", "text/html")
   res.sendFile(indexPath)
})

module.exports = router