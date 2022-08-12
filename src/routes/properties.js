const express = require("express")
const router = express.Router()

const { getProperties, setProperty, getProperty, deleteProperty, updateProperty } = require("../controllers/properties")

router.route('/').get(getProperties)
   .post(setProperty)

router.route('/:property').get(getProperty)
   .delete(deleteProperty)
   .patch(updateProperty)

module.exports = router