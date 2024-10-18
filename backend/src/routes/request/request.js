const express = require("express")
const router = express.Router();
const Request = require('../../controllers/requests/request')

router.post('/stu-course', Request.get_s_r_count)
router.post('/stu-avail', Request.stuAvailable)

module.exports = router