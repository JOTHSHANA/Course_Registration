const express = require("express")
const router = express.Router();
const deptartments = require('../../controllers/dept/dept')

router.get('/dept', deptartments.get_dept)

module.exports = router;
