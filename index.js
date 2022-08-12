const app = require("./src/app")
require("./src/database/index")

const port = process.env.port || 8000

app.listen(port, () => {
   console.log("listening on http://localhost:8000/")
})