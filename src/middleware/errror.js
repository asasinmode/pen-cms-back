module.exports = (err, req, res, next) => {
   const responseStatus = res.statusCode || 500
   res.status(responseStatus)

   const rv = { message: err.message }

   if(process.env.NODE_ENV == 'production'){
      rv.stack = err.stack
   }

   res.json(rv)
}