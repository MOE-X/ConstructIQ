const { Project } = require('../models')
const { PStatus } = require('../models')
const { _404 } = require('./errorController')
const { validationResult } = require('express-validator')
const { isNumber } = require('../util/validation/functions')

exports.create = (req, res, next) => {
    const { projectDescription, location, areaInM2, pricePerM2, startingDate, endingDate, pStatusId } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            response: {
                success: false,
                errors: {
                    field: errors.array()[0].path,
                    msg: errors.array()[0].msg,
                },
                old: {
                    projectDescription: projectDescription,
                    location: location,
                    areaInM2: areaInM2,
                    pricePerM2: pricePerM2,
                    startingDate: startingDate,
                    endingDate: endingDate,
                    pStatusId: pStatusId
                }
            }
        })
    }
    PStatus.findByPk(pStatusId)
        .then(pStatus => {
            pStatus.createProject({
                projectDescription: projectDescription,
                location: location,
                areaInM2: areaInM2,
                pricePerM2: pricePerM2,
                startingDate: startingDate,
                endingDate: endingDate
            })
                .then(project => {
                    if (!project) {
                        return res.status(500).json({
                            response: {
                                success: false,
                                msg: 'Something went wrong',
                                redirect: 'worker'
                            }
                        })
                    }
                    return res.status(201).json({
                        response: {
                            success: true,
                            msg: 'Project created successfully',
                            project: project
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        })
        .catch(err => {
            console.error('Error: ', err)
        })
}

exports.load = (req, res, next) => {
    Project.findAll({
        include: PStatus
    })
        .then(projects => {
            if (!projects) {
                return res.status(404).json({
                    response: {
                        success: false,
                        msg: 'No projects found'
                    }
                })
            }
            return res.status(200).json({
                response: {
                    success: true,
                    projects: projects
                }
            })
        })
}

exports.getProject = (req, res, next) => {
    const projectId = req.params.projectId
    if (!isNumber(projectId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'projectId param should be a number'
                }
            }
        })
    }
    Project.findByPk(projectId, { include: PStatus })
        .then(project => {
            if (!project) {
                return _404(req, res, next, 'Project not found')
            }
            res.status(200).json({
                response: {
                    success: true,
                    msg: 'Project fetched',
                    project: project
                }
            })
        })
        .catch(err => {
            console.error('Error: ', err)
        })
}

exports.update = (req, res, next) => {
    const projectId = req.params.projectId
    const { projectDescription, location, areaInM2, pricePerM2, startingDate, endingDate, pStatusId } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            response: {
                success: false,
                errors: {
                    field: errors.array()[0].path,
                    msg: errors.array()[0].msg,
                },
                old: {
                    projectDescription: projectDescription,
                    location: location,
                    areaInM2: areaInM2,
                    pricePerM2: pricePerM2,
                    startingDate: startingDate,
                    endingDate: endingDate,
                    pStatusId: pStatusId
                }
            }
        })
    }
    if (!isNumber(projectId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'projectId param should be a number'
                }
            }
        })
    }
    Project.findByPk(projectId)
        .then(project => {
            if (!project) {
                return _404(req, res, next, 'Project not found')
            }
            project.projectDescription = projectDescription
            project.location = location
            project.areaInM2 = areaInM2
            project.pricePerM2 = pricePerM2
            project.startingDate = startingDate
            project.endingDate = endingDate
            project.pStatusId = pStatusId
            project.save()
                .then(result => {
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Project updated successfully',
                            updatedProject: result
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })

        })
        .catch(err => {
            console.error('Error:', err)
        })
}

exports.destroy = (req, res, next) => {
    const projectId = req.params.projectId
    if (!isNumber(projectId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'projectId param should be a number'
                }
            }
        })
    }
    Project.findByPk(projectId)
        .then(project => {
            if (!project) {
                return _404(req, res, next, 'Project not found')
            }
            project.destroy({ where: { projectId: projectId } })
                .then(result => {
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Project deleted successfully'
                        }
                    })
                })
        })
        .catch(err => {
            console.error('Error:', err)
        })
}