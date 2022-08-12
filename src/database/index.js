const mongoose = require("mongoose")

const connect = async () => {
   try {
      const conn = await mongoose.connect(process.env.DATABASE_URI)
      console.log(`connected to MongoDB at ${ conn.connection.host }`)
   } catch(e){
      console.error(e)
      process.exit(1)
   }
}

module.exports = connect