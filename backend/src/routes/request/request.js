const express = require("express")
const router = express.Router();
const Request = require('../../controllers/requests/request')

router.post('/stu-course', Request.get_s_r_count)
router.post('/stu-avail', Request.stuAvailable)
router.post('/c-request', Request.request)
router.post('/stu-req', Request.getRequestedCourse)
router.post('/stu-app', Request.ApprovedCourse)
router.post('/stu-rej', Request.RejectedCourse)

module.exports = router