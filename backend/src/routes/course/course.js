const express = require("express")
const router = express.Router();
const Course = require('../../controllers/courses/courses')
const CType = require('../../controllers/courses/type')

router.post('/course',Course.get_courseAvailable)
router.post('/course-all', Course.getAllCourse)
router.post('/c-type', CType.get_courseType)
router.get('/course-type', CType.getAllType)

module.exports = router;
