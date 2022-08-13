import express from "express"
import { URL } from 'url'
const router = express.Router()

router.get("/", (_, res) => {
   const indexPath = decodeURI(new URL("../assets/index.html", import.meta.url).pathname).slice(1)

   res.set("Content-Type", "text/html")
   res.sendFile(indexPath)
})

export default router
