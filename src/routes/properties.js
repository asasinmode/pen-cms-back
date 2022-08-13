const express = require("express")
const router = express.Router()

const { getProperties, setProperty, getProperty, deleteProperty, updateProperty } = require("../controllers/properties")
const { protect } = require("../middleware/auth")

router.route('/').get(getProperties)
   .post(protect, setProperty)

router.route('/:property').get(getProperty)
   .delete(protect, deleteProperty)
   .patch(protect, updateProperty)

module.exports = router