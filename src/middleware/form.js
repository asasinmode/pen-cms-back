import formidable from "formidable"

const form = (req, res) => {
   return new Promise((resolve, reject) => {
      const form = formidable({ keepExtensions: true })

      if(!req.headers["content-type"] || !req.headers["content-type"].startsWith('multipart/form-data')){
         res.status(400)
         reject("body needs to be form data")
         return
      }

      form.parse(req, (err, fields, files) => {
         if(err){
            console.error(err)
            res.status(500)
            reject("error processing form data")
         }

         resolve({ fields, files })
      })
   })
}

export { form }
