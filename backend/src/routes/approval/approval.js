const express = require("express")
const router = express.Router();
const approve = require('../../controllers/approval/approval')

router.post('/approval-req', approve.approval)
router.post('/reject', approve.rejectRequest)

module.exports = router;
