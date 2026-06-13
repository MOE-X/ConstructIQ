const express = require('express')
const { body } = require("express-validator")
const workerController = require('../controllers/workerController')
const isAuth = require('../middleware/isAuth')
const validation = require('../middleware/validation')
const { WRole, Worker } = require('../models')

const router = express.Router()

router.get('/', isAuth, workerController.load)

router.get('/worker/:workerId', isAuth, workerController.getWorker)

router.post('/', isAuth, validation.bodyValidation(), validation.createWorkerValidation(), workerController.create)

router.put('/worker/:workerId', isAuth, validation.bodyValidation(), validation.updateWorkerValidation(), workerController.update)

router.delete('/worker/:workerId', isAuth, workerController.destroy)


module.exports = router