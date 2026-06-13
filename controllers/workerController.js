const { Worker } = require('../models')
const { WRole } = require('../models')
const { validationResult } = require('express-validator')
const { isNumber } = require('../util/validation/functions')
const { _404, _500 } = require('./errorController')

exports.create = (req, res, next) => {
    const { fullName, dob, phone, address, account, wRoleId } = req.body
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
                    fullName: fullName,
                    dob: dob,
                    phone: phone,
                    address: address,
                    account: account,
                    wRoleId: wRoleId
                }
            }
        })
    }
    WRole.findByPk(wRoleId)
        .then(wRole => {
            wRole.createWorker({
                fullName: fullName,
                dob: dob,
                phone: phone,
                address: address,
                account: account
            })
                .then(worker => {
                    if (!worker) {
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
                            msg: 'Worker created successfully',
                            worker: worker
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
    Worker.findAll({
        include: WRole
    })
        .then(workers => {
            if (!workers) {
                return res.status(404).json({
                    response: {
                        success: false,
                        msg: 'No workers found'
                    }
                })
            }
            return res.status(200).json({
                response: {
                    success: true,
                    workers: workers
                }
            })
        })
}

exports.getWorker = (req, res, next) => {
    const workerId = req.params.workerId
    if (!isNumber(workerId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'workerId param should be a number'
                }
            }
        })
    }
    Worker.findByPk(workerId, {include: WRole})
        .then(worker => {
            if (!worker) {
                return _404(req, res, next, 'Worker not found')
            }
            res.status(200).json({
                response: {
                    success: true,
                    msg: 'Worker fetched',
                    worker: worker
                }
            })
        })
        .catch(err => {
            console.error('Error: ', err)
        })

}

exports.update = (req, res, next) => {
    const workerId = req.params.workerId
    if (!isNumber(workerId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'workerId param should be a number'
                }
            }
        })
    }
    const { fullName, dob, phone, address, account, wRoleId } = req.body
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
                    fullName: fullName,
                    dob: dob,
                    phone: phone,
                    address: address,
                    account: account,
                    wRoleId: wRoleId
                }
            }
        })
    }

    Worker.findByPk(workerId)
        .then(worker => {
            if (!worker) {
                return _404(req, res, next, 'Worker not found')
            }
            //If nothing was updated
            // console.log(worker)
            // if (worker.fullName === fullName && worker.dob === dob && worker.phone === phone && worker.address === address && worker.account === account && worker.wRoleId === wRoleId) {
            //     return res.status(200).json({
            //         response: {
            //             success: true,
            //             msg: 'Nothing changed'
            //         }
            //     })
            // }
            // If any field was updated
            worker.fullName = fullName
            worker.dob = dob
            worker.phone = phone
            worker.address = address
            worker.account = account
            worker.wRoleId = wRoleId

            return worker.save()
                .then(result => {
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Worker updated successfully',
                            updatedWorker: result
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

exports.destroy = (req, res, next) => {
    const workerId = req.params.workerId
    if (!isNumber(workerId)) {
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    msg: 'workerId param should be a number'
                }
            }
        })
    }
    Worker.findByPk(workerId)
    .then(worker => {
        if (!worker) {
            return _404(req, res, next, 'Worker not found')
        }
        Worker.destroy({where: {workerId: workerId}})
        .then(result => {
            return res.status(200).json({
                response: {
                    success: true,
                    msg: 'Worker deleted successfully'
                }
            })
        })
    })
    .catch(err => {
        console.error('Error: '. err)
    })
}