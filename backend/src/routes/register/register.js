const express = require("express")
const router = express.Router();
const Register = require('../../controllers/register/register')

router.post('/c-register', Register.CourseRegister)
router.post('/registered', Register.get_RegisteredCourse)
router.post('/s-register', Register.getStuRegister)

module.exports = router;
