const express = require('express')
const isAuth = require('../middleware/isAuth')
const validation = require('../middleware/validation')
const projectController = require('../controllers/projectController')
const { PStatus } = require('../models')
const { body } = require('express-validator')
const router = express.Router()

router.get('/', isAuth, projectController.load)

router.get('/project/:projectId', isAuth, projectController.getProject)

router.post('/', isAuth, validation.bodyValidation(), validation.createProjectValidation(), projectController.create)

router.put('/project/:projectId', isAuth, validation.bodyValidation(), validation.updateProjectValidation(), projectController.update)

router.delete('/project/:projectId', isAuth, projectController.destroy)

module.exports = router