module.exports = (err, req, res, next) => {
   console.error(err)
   const responseStatus = res.statusCode || 500
   res.status(responseStatus)

   const rv = { message: err.message }

   res.json(rv)
}