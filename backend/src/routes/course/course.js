const express = require("express")
const router = express.Router();
const Course = require('../../controllers/courses/courses')
const CType = require('../../controllers/courses/type')

router.post('/course',Course.get_courseAvailable)
router.get('/c-type', CType.get_courseType)

module.exports = router;
