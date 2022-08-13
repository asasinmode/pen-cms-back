import formidable from "formidable"

const form = (req) => {
   return new Promise((resolve, reject) => {
      const form = formidable()

      form.parse(req, (err, fields, files) => {
         if(err){
            console.error(err)
            reject(err)
         }

         resolve({ fields, files })
      })
   })
}

export { form }
