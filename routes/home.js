const express = require('express')
const homeController = require('../controllers/homeController')
const isAuth = require('../middleware/isAuth')
const validation = require('../middleware/validation')
const router = express.Router()


router.get('/', isAuth, homeController.load)

router.get('/project/:projectId', isAuth, homeController.getData)

router.post('/project/:projectId', isAuth, validation.bodyValidation(), validation.createPaymentValidation(), homeController.addData)

module.exports = router