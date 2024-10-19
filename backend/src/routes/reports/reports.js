const express = require("express")
const router = express.Router();
const Reports = require('../../controllers/reports/reports')

router.post('/c-report', Reports.getCourseReport)

module.exports = router;
