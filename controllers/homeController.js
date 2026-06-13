const { Op, Sequelize } = require('sequelize')
const { Project, PStatus, Expense, Worker, WRole, Attendance, Payment, Account } = require('../models/')
const { _404 } = require('./errorController')
const { validateCreateAttendances, validateCreatePayments, validateCreateExpenses } = require('../util/validation/functions')
const validation = require('../middleware/validation')
const { validationResult } = require('express-validator')

exports.load = async (req, res, next) => {
    //Pending projects
    let pendingProjects
    pendingProjects = await Project.findAll({ where: { pStatusId: 1 } })
    pendingProjects = await Promise.all(
        pendingProjects.map(async project => {
            const paymentAmount = await Payment.sum('paymentAmount', { where: { projectId: project.projectId } })
            const expenses = await Expense.sum('`expenseAmount`', { where: { projectId: project.projectId } })
            return {
                ...project.dataValues,
                income: project.dataValues.areaInM2 * project.dataValues.pricePerM2,
                outcome: paymentAmount + expenses
            }

        })
    )

    //In progress projects
    let inProgressProjects
    inProgressProjects = await Project.findAll({ where: { pStatusId: 2 } })
    inProgressProjects = await Promise.all(
        inProgressProjects.map(async project => {
            const paymentAmount = await Payment.sum('paymentAmount', { where: { projectId: project.projectId } })
            const expenses = await Expense.sum('`expenseAmount`', { where: { projectId: project.projectId } })
            return {
                ...project.dataValues,
                income: project.dataValues.areaInM2 * project.dataValues.pricePerM2,
                outcome: paymentAmount + expenses
            }

        })
    )

    //Completed projects
    let completedProjects
    completedProjects = await Project.findAll({ where: { pStatusId: 3 } })
    completedProjects = await Promise.all(
        completedProjects.map(async project => {
            const paymentAmount = await Payment.sum('paymentAmount', { where: { projectId: project.projectId } })
            const expenses = await Expense.sum('`expenseAmount`', { where: { projectId: project.projectId } })
            return {
                ...project.dataValues,
                income: project.dataValues.areaInM2 * project.dataValues.pricePerM2,
                outcome: paymentAmount + expenses
            }

        })
    )
    res.status(200).json({
        response: {
            success: true,
            msg: 'Projects fetched',
            projects: {
                pendingProjects: pendingProjects,
                inProgressProjects: inProgressProjects,
                completedProjects: completedProjects
            }
        }
    })
}

exports.getData = async (req, res, next) => {
    const projectId = req.params.projectId
    const project = await Project.findOne({ where: { projectId: projectId } })
    if (!project) {
        return _404(req, res, next, 'Project not found')
    }
    const action = req.query.action
    if (!req.body) {
        if (action === 'getAttendances') {
            Attendance.findAll({
                where: {
                    projectId: projectId
                },
                include: [
                    {
                        model: Worker,
                        attributes: ['fullName'],
                        include: [
                            {
                                model: WRole,
                                attributes: ['role']
                            }
                        ]
                    }
                ]
            })
                .then(attendances => {
                    if (!attendances) {
                        return res.status(200).json({
                            response: {
                                success: false,
                                msg: 'There is no data'
                            }
                        })
                    }
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Attendances fetched',
                            attendances: attendances
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        }
        else if (action === 'getPayments') {
            //Fetching payed Payments
            const completedPayments = await Payment.findAll({
                where: {
                    projectId: projectId
                },
                include: [
                    {
                        model: Worker,
                        attributes: ['fullName'],
                        include: [
                            {
                                model: WRole,
                                attributes: ['role']
                            }
                        ]
                    }
                ]
            })
            const pendingPayments = await Account.findAll({
                attributes: [
                    'workerId',
                    'account'
                ],
                where: {
                    account: { [Op.gt]: 0 }
                },
                group: 'workerId',
                include: [
                    {
                        model: Worker,
                        attributes: [
                            'fullName'
                        ],
                        include: [
                            {
                                model: WRole,
                                attributes: ['role']
                            }
                        ]
                    }
                ]
            })
            return res.status(200).json({
                response: {
                    success: true,
                    msg: 'Payments fetched',
                    payments: {
                        completed: completedPayments,
                        pending: pendingPayments
                    }
                }
            })
        }
        else if (action === 'getExpenses') {
            project.getExpenses({ include: Project })
                .then(expenses => {
                    if (!expenses) {
                        return res.status(200).json({
                            response: {
                                success: false,
                                msg: 'There is no data'
                            }
                        })
                    }
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Expenses fetched',
                            expenses: expenses
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        }
    } else {
        const filter = req.body.filter
        if (action === 'filterAttendances') {
            if (filter === "") {
                return res.status(200).json({
                    response: {
                        success: true,
                        redirect: 'Redirect to project attendances'
                    }
                })
            }
            Attendance.findAll({
                where: {
                    projectId: projectId,
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.cast(Sequelize.col('attendanceDate'), 'CHAR'),
                            { [Op.like]: `%${filter}%` }
                        ),
                        { isWorking: { [Op.like]: `%${filter}%` } },
                        { dayRate: { [Op.like]: `%${filter}%` } },
                        { '$Worker.fullName$': { [Op.like]: `%${filter}%` } },
                        { '$Worker.WRole.role$': { [Op.like]: `%${filter}%` } }
                    ]
                },
                include: [
                    {
                        model: Worker,
                        attributes: ['fullName'],
                        include: [
                            {
                                model: WRole,
                                attributes: ['role']
                            }
                        ]
                    }
                ]
            })
                .then(filteredAttendances => {
                    if (!filteredAttendances) {
                        return res.status(200).json({
                            response: {
                                success: false,
                                msg: 'There is no data'
                            }
                        })
                    }
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Filtered Attendances fetched',
                            filteredAttendances: filteredAttendances
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        } else if (action === 'filterPayments') {
            if (filter === "") {
                return res.status(200).json({
                    response: {
                        success: true,
                        redirect: 'Redirect to project payments'
                    }
                })
            }
            Payment.findAll({
                where: {
                    projectId: projectId,
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.cast(Sequelize.col('paymentDate'), 'CHAR'),
                            { [Op.like]: `%${filter}%` }
                        ),
                        { paymentAmount: { [Op.like]: `%${filter}%` } },
                        { '$Worker.fullName$': { [Op.like]: `%${filter}%` } },
                        { '$Worker.Wrole.role$': { [Op.like]: `%${filter}%` } }
                    ]
                },
                include: [
                    {
                        model: Worker,
                        attributes: ['fullName'],
                        include: [
                            {
                                model: WRole,
                                attributes: ['role']
                            }
                        ]
                    }
                ]
            })
                .then(filteredPayments => {
                    if (!filteredPayments) {
                        return res.status(200).json({
                            response: {
                                success: false,
                                msg: 'There is no data'
                            }
                        })
                    }
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Filtered Payments fetched',
                            filteredPayments: filteredPayments
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        } else if (action === 'filterExpenses') {
            if (filter === "") {
                return res.status(200).json({
                    response: {
                        success: true,
                        redirect: 'Redirect to project expenses'
                    }
                })
            }
            project.getExpenses({
                where: {
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.cast(Sequelize.col('expenseDate'), 'CHAR'),
                            { [Op.like]: `%${filter}%` }
                        ),
                        { expenseDescription: { [Op.like]: `%${filter}%` } },
                        { expenseAmount: { [Op.like]: `%${filter}%` } }
                    ]
                }
            })
                .then(expenses => {
                    if (!expenses) {
                        return res.status(200).json({
                            response: {
                                success: false,
                                msg: 'There is no data'
                            }
                        })
                    }
                    return res.status(200).json({
                        response: {
                            success: true,
                            msg: 'Expenses fetched',
                            expenses: expenses
                        }
                    })
                })
                .catch(err => {
                    console.error('Error: ', err)
                })
        }
    }
}

exports.actionBasedValidation = (req, res, next) => {
    const action = req.query.action
    let val
    if (action === 'addAttendances') {
        val = validation.createAttendanceValidation()
    } else if (action === 'addPayments') {
        val = validation.createPaymentValidation()
    } else if (action === 'addExpenses') {
        val = validation.createExpenseValidation()
    }
    return val
}

exports.addData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const field = errors.array()[0].path.slice(+errors.array()[0].path.indexOf('.') + 1)
        const row = +errors.array()[0].path.slice(+errors.array()[0].path.indexOf('[') + 1, errors.array()[0].path.indexOf(']')) + 1 || 0
        return res.status(422).json({
            response: {
                success: false,
                error: {
                    field: errors.array()[0].path ? `${field} on row ${+errors.array()[0].path.slice(+errors.array()[0].path.indexOf('[') + 1, errors.array()[0].path.indexOf(']')) + 1 || 0}` : 'body',
                    msg: errors.array()[0].msg
                },
                errors: errors
            }
        })
    }
    const projectId = req.params.projectId
    const project = await Project.findOne({ where: { projectId: projectId } })
    if (!project) {
        return _404(req, res, next, 'Project not found')
    }
    const { action } = req.query
    //Checking attendance eligibility
    if (action === 'checkAttendance') {
        //checking for the project status 
        if (project.pStatusId === 3) {
            return res.status(422).json({
                response: {
                    success: false,
                    msg: 'Cannot add attendance for a completed project'
                }
            })
        } else if (project.pStatusId === 1) {
            return res.status(422).json({
                response: {
                    success: false,
                    msg: 'Cannot add attendance for a pending project'
                }
            })
        }
        //checking eligibilioty of the desired date

        const { date } = req.body
        const attendanceDate = new Date(date)
        const projectDate = new Date(project.startingDate)
        if (attendanceDate < projectDate) {
            return res.status(422).json({
                response: {
                    success: false,
                    msg: 'The chosen date is out of the projects\' starting date\'s range '
                }
            })
        }
        const workers = await Worker.findAll({
            attributes: ['workerId', 'fullName'],
            include: [
                {
                    model: WRole,
                    attributes: ['role']
                }
            ]
        })

        return res.status(200).json({
            response: {
                success: true,
                msg: 'Entered date meets the requirements',
                workers: workers
            }
        })
    }
    else if (action === 'addAttendances') {
        //Data validation
        const attendances = req.body.attendances
        const errors = validateCreateAttendances(attendances)
        if (errors.length !== 0) {
            return res.status(422).json({
                response: {
                    success: false,
                    error: errors
                }
            })
        }
        //Checking for and false isWorking fields and changing their corresponding dayRate field, also adding the projectId to each attendance
        attendances.forEach((attendance, index) => {
            //if we dont want to warn about the isWorking error
            // if (!attendance.isWorking) {
            //     attendance.dayRate = 0
            // }
            attendances[index] = {
                projectId: projectId,
                ...attendance
            }
        })
        // Creating the attendances
        Attendance.bulkCreate(attendances)
            .then(attendances => {
                if (!attendances) {
                    return res.status(500).json({
                        response: {
                            success: false,
                            msg: 'Something went wrong'
                        }
                    })
                }
                attendances.forEach(async attendance => {
                    const worker = await Worker.findOne({ where: { workerId: attendance.workerId } })
                    const accounts = await worker.getAccounts({ where: { projectId: projectId } })
                    const account = accounts[0]
                    if (!account) {
                        await worker.createAccount({
                            projectId: projectId,
                            // workerId: attendance.workerId,
                            account: attendance.dayRate
                        })
                        console.log(`Account created for ${worker.fullName}`);
                        return
                    }
                    if (!attendance.isWorking) {
                        return
                    }
                    account.account += attendance.dayRate
                    await account.save()
                    console.log(`Account updated for ${worker.fullName}`)
                })
                return res.status(200).json({
                    response: {
                        success: true,
                        msg: 'Attendances created',
                        attendances: attendances
                    }
                })
            })
            .catch(err => {
                console.error('Error: ', err)
            })
    }
    else if (action === 'addPayments') {
        //Data validation
        const payments = req.body.payments
        const errors = validateCreatePayments(payments)
        if (errors.length !== 0) {
            return res.status(422).json({
                response: {
                    success: false,
                    error: errors
                }
            })
        }
        // adding the projectId and the paymentDate to each payment, and checking if any worker has insufficient balance
        let canDeduct = true
        let workerName
        for (const [index, payment] of payments.entries()) {
            // adding the projectId and the paymentyDate
            const temp = Object.entries(payment)
            temp.splice(0, 0, ['projectId', projectId])
            temp.splice(2, 0, ['paymentDate', new Date()])
            payments[index] = Object.fromEntries(temp)
            //Checking for each worker's account
            const worker = await Worker.findOne({ where: { workerId: payment.workerId } })
            const accounts = await worker.getAccounts({ where: { projectId: projectId } })
            const account = accounts[0]
            // console.log('The account:::::: ', account)
            console.log('The payment:::::: ', canDeduct)
            if (payment.paymentAmount > account.account) {
                canDeduct = false
                workerName = worker.fullName
                // return res.status(422).json({
                //     response: {
                //         success: false,
                //         msg: `${worker.fullName} doesn\'t have sufficient balance`
                //     }
                // })
            }
        }
        if (!canDeduct) {
            return res.status(422).json({
                response: {
                    success: false,
                    msg: `${workerName} doesn\'t have sufficient balance`
                }
            })
        }

        //creating the rows
        Payment.bulkCreate(payments)
            .then(payments => {
                if (!payments) {
                    return res.status(500).json({
                        response: {
                            success: false,
                            msg: 'Something went wrong'
                        }
                    })
                }
                payments.forEach(payment => {
                    Worker.findOne({ where: { workerId: payment.workerId } })
                        .then(worker => {
                            worker.getAccounts({ where: { projectId: projectId } })
                                .then(accounts => {
                                    const account = accounts[0]
                                    account.account -= payment.paymentAmount
                                    account.save()
                                        .then(result => {
                                            console.log(`account updated for ${worker.fullName}`)
                                        })
                                })
                        })
                })
                return res.status(200).json({
                    response: {
                        success: true,
                        msg: 'Payments added successfully',
                        payments: payments
                    }
                })
            })
            .catch(err => {
                console.error('Error: ', err)
            })
    }
    else if (action === 'addExpenses') {
        //Data validation
        const expenses = req.body.expenses
        const errors = validateCreateExpenses(expenses)
        if (errors.length !== 0) {
            return res.status(422).json({
                response: {
                    success: false,
                    error: errors
                }
            })
        }
        //adding the projectId
        expenses.forEach(expense => {
            expense.projectId = projectId
        })
        Expense.bulkCreate(expenses)
            .then(expenses => {
                if (!expenses) {
                    return res.status(500).json({
                        response: {
                            success: false,
                            msg: 'Something went wrong'
                        }
                    })
                }
                return res.status(201).json({
                    response: {
                        success: true,
                        msg: 'Expenses added successfully',
                        expense: expenses
                    }
                })
            })
            .catch(err => {
                console.error('Error: ', err)
            })

    }
}