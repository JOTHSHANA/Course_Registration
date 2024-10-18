const express = require("express")
const router = express.Router();
const Register = require('../../controllers/register/register')

router.post('/c-register', Register.CourseRegister)

module.exports = router;
