const app = require("./src/app")

const port = process.env.port || 8000

app.listen(port, () => {
   console.log("listening on http://localhost:8000/")
})