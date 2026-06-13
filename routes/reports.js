const express = require('express')
const reportsController = require('../controllers/reportsController')
const isAuth = require('../middleware/isAuth')
const router = express.Router()

router.get('/', isAuth, reportsController.getAllIncomeOutcome)

// router.post('/', isAuth, reportsController.getData)

module.exports = router