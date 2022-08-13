export default function (err, req, res, next){
   const responseStatus = res.statusCode !== 200 ? res.statusCode : 500
   res.status(responseStatus)

   if(responseStatus === 500){
      console.error(err)
   }

   const rv = { message: responseStatus !== 500 ? err.message : 'unknown error has occurred' }

   res.json(rv)
}
