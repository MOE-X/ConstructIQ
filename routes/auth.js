const express = require('express')
const validation = require('../middleware/validation')
const authController = require('../controllers/authController')
const test = require('../controllers/test')

const router = express.Router()


//Login
// router.get('/', authController.loginPage)
router.post('/', validation.bodyValidation(), validation.loginValidation() ,authController.login)

//Signup
router.post('/register', validation.bodyValidation(), validation.registerValidation(), authController.register)

router.post('/test', test.createTest)

module.exports = router