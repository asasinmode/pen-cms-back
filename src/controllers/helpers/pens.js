import cloudinary from "../../plugins/cloudinary.js"
import sizeOf from "image-size"

const validMimeTypes = ['image/webp', 'image/png', 'image/jpeg']

const validateFormData = (formdata, canNameBeUndefined = false) => {
   const fields = formdata.fields

   const isNameUndefined = fields.name === undefined
   if(!canNameBeUndefined && isNameUndefined){
      return "field `name` is required"
   }

   const isNameValid = canNameBeUndefined ?
      fields.name === undefined || (fields.name && fields.name[0] !== "")
      : fields.name && fields.name[0] !== ""
   if(!isNameValid){
      return "name cannot be empty"
   }

   try {
      if(fields.properties !== undefined){
         const parseResults = JSON.parse(fields.properties[0])
         if(typeof parseResults !== 'object'){ return "invalid properties format" }

         const hasBrand = parseResults.brand
         if(!hasBrand){ return "property \"brand\" is required" }

         const hasInkColor = parseResults['ink color']
         if(!hasInkColor){ return "property \"ink color\" is required" }
      }
   } catch(e){
      return "invalid properties format"
   }

   const isImageValid = !formdata.files.image || validMimeTypes.includes(formdata.files.image[0].mimetype)
   if(!isImageValid){
      return "invalid image mimetype. supported: jpeg, png, webp"
   }

   return ""
}

const uploadToCloudinary = (image) => {
   return new Promise((resolve, reject) => {
      const path = image.filepath
      const { width, height } = sizeOf(path)

      let transformationObject = {}
      if(width > 500 && width > height){
         transformationObject.width = 500
         transformationObject.crop = "pad"
      } else if(height > 500 && height > width) {
         transformationObject.height = 500
         transformationObject.crop = "pad"
      }

      cloudinary.uploader.upload(path, {
            ...transformationObject,
            folder: 'pen-cms'
         }, (err, result) => {
            if(err){
               console.error(err.message)
               reject(err.message)
            }

            resolve(result)
         })
   })
}

const deleteFromCloudinary = (imageURL) => {
   return new Promise((resolve, reject) => {
      const public_id = imageURL.substr(imageURL.lastIndexOf('/') + 1).split(".")[0]
      cloudinary.uploader.destroy(`pen-cms/${ public_id }`, {}, (err, result) => {
         if(err){
            console.error(err.message)
            reject(err.message)
         }

         resolve(result)
      })
   })
}

export { validateFormData, uploadToCloudinary, deleteFromCloudinary }