require("dotenv/config")

const app = require("./src/app")
const port = process.env.PORT || 8000

require("./src/database/index")()

app.listen(port, () => {
   console.log("listening on http://localhost:8000/")
})