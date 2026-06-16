const express = require('express')
const homeController = require('../controllers/homeController')
const isAuth = require('../middleware/isAuth')
const validation = require('../middleware/validation')
const router = express.Router()


router.get('/', isAuth, homeController.load)

router.get('/project/:projectId', isAuth, homeController.getData)

router.post('/project/:projectId/attendances', isAuth, validation.bodyValidation(), validation.createAttendancesValidation(), homeController.addData)

router.post('/project/:projectId/payments', isAuth, validation.bodyValidation(), validation.createPaymentsValidation(), homeController.addData)

router.post('/project/:projectId/expenses', isAuth, validation.bodyValidation(), validation.createExpensesValidation(), homeController.addData)

module.exports = router