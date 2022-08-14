import cloudinary from "../../plugins/cloudinary.js"
import sizeOf from "image-size"

const validMimeTypes = ['image/webp', 'image/png', 'image/jpeg']

const validateFormData = (formdata) => {
   const fields = formdata.fields
   const isNameValid = fields.name && fields.name[0] !== ""

   if(!isNameValid){
      return "name cannot be empty"
   }

   try {
      if(fields.properties !== undefined){
         const parseResults = JSON.parse(fields.properties[0])
         if(typeof parseResults !== 'object'){ throw new Error() }
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

const uploadToCloudinary = (image, name) => {
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
            folder: 'pen-cms',
            public_id: name
         }, (err, result) => {
            if(err){
               console.error(err.message)
               reject(err.message)
            }

            resolve(result)
         })
   })
}

export { validateFormData, uploadToCloudinary }