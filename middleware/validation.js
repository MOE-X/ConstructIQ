const { check, body } = require('express-validator')
const { User, Project } = require('../models')

exports.bodyValidation = () => {
    return [
        body()
            .custom((value, { req }) => {
                if (!req.body) {
                    throw new Error('Body should exist')
                }
                if (Object.keys(req.body).length === 0) {
                    throw new Error('Request body cannot be empty');
                }
                return true
            })
    ]
}

//Auth
exports.loginValidation = () => {
    return [
        check('userName')
            .isEmail()
            .withMessage('Enter a valid email')
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ where: { userName: value } })
                    .then(user => {
                        if (!user) {
                            return Promise.reject('Email doesn\'t exist')
                        }
                    })
            }),
        check('password', 'Password must be alphanumeric 5 characters long')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ]
}

exports.registerValidation = () => {
    return [
        body('userName')
            .isEmail()
            .withMessage('Please enter a valid e-mail')
            .custom((value, { req }) => {
                return User.findOne({ where: { userName: value } })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email already exists')
                        }
                    })
            })
            .normalizeEmail(),
        body('password', 'Password should be alphanumeric and at least 5 characters in length')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (!value) {
                    throw new Error('Confirm Password is required')
                }
                if (value !== req.body.password) {
                    throw new Error('Passwords should match')
                }
                return true
            })
    ]
}

//Project
exports.createProjectValidation = () => {
    return [
        body('projectDescription', 'Project description is required')
            .isLength({ min: 1 })
            .isString()
            .trim(),
        body('location')
            .isString()
            .withMessage('Enter a valid date format'),
        body('areaInM2', 'Area is required and should be a number')
            .isLength({ min: 1 })
            .isNumeric(),
        body('pricePerM2', 'Price is required and should be a number')
            .isLength({ min: 1 })
            .isNumeric(),
        body('startingDate', 'Invalid date format')
            .isDate(),
        body('endingDate', 'Invalid date format')
            .isDate(),
        body('pStatusId', 'Project status should be numeric and has to be 1 digit only')
            .isLength({ min: 1, max: 1 })
            .isNumeric()
            .custom(value => {
                return PStatus.findByPk(value)
                    .then(pStatus => {
                        if (!pStatus) {
                            return Promise.reject('Project status doesnt exist')
                        }
                    })
            })
    ]
}

exports.updateProjectValidation = () => {
    return this.createProjectValidation()
}

//Worker
exports.createWorkerValidation = () => {
    return [
        body('fullName', 'Worker name should be alphabetice and min 3 characters long')
            .isLength({ min: 3 })
            .isAlpha()
            .trim(),
        body('dob')
            .isDate()
            .withMessage('Enter a valid date format'),
        body('phone', 'Phone number should be numeric and 8 numbers long')
            .isLength({ min: 8, max: 8 })
            .isNumeric(),
        body('address', 'Address should be 3 characters long')
            .isLength({ min: 3 })
            .isString(),
        body('account', 'Account is required and should be a number')
            .isNumeric(),
        body('wRoleId', 'Worker role should be numeric and has to be 1 digit only')
            .isLength({ min: 1, max: 1 })
            .isNumeric()
            .custom(value => {
                return WRole.findByPk(value)
                    .then(wRole => {
                        if (!wRole) {
                            return Promise.reject('Worker role doesnt exist')
                        }
                    })
            })
    ]
}

exports.updateWorkerValidation = () => {
    return this.createWorkerValidation()
}

//Home
exports.createAttendancesValidation = () => {
    let isWorking
    return [
        body('attendances')
            .isArray({ min: 1, max: 1 })
            .withMessage('attendances field must be a non-empty array'),
        body('attendances.*.workerId')
            .isInt({ min: 1 })
            .withMessage('workerId field must be a positive integer'),
        // .custom((value, { req }) => {
        //     if (value < 0) {
        //         throw new Error('workerId field must be positive')
        //     }
        // }),
        body('attendances.*.attendanceDate')
            .isDate()
            .withMessage('attendanceDate must be a valid date')
            .custom(async (value, { req }) => {
                return Project.findByPk(req.params.projectId)
                    .then((project) => {
                        const attendanceDate = new Date(value)
                        const projectSDate = new Date(project.startingDate)
                        const projectEDate = new Date(project.endingDate)
                        if (attendanceDate < projectSDate || attendanceDate > projectEDate) {
                            return Promise.reject('attendanceDate out of project range')
                        }
                    })
            }),
        body('attendances.*.isWorking')
            .isBoolean()
            .withMessage('isWorking field must be a boolean')
            .custom((value, { req }) => {
                isWorking = value
                return true
            }),
        body('attendances.*.dayRate')
            .isNumeric()
            .withMessage('dayRate field must be a number')
            .custom((value, { req }) => {
                if (value < 0) {
                    throw new Error('dayRate must be positive')
                }
                if (!isWorking && value > 0) {
                    throw new Error('Wrong entry')
                }
                return true
            })
    ]
}

exports.createPaymentsValidation = () => {
    return [
        body('payments')
            .isArray({ min: 1, max: 1 })
            .withMessage('payments field must be a non-empty array'),
        body('payments.*.workerId')
            .isInt({ min: 1 })
            .withMessage('workerId field must be a positive integer'),
        body('payments.*.paymentDate')
            .isDate()
            .withMessage('Invalid date'),
        body('payments.*.paymentAmount')
            .isNumeric()
            .withMessage('paymentAmount should be a number')
            .custom((value, { req }) => {
                if (value < 0) {
                    throw new Error('paymentAmount field must be positive')
                }
            })
    ]
}

exports.createExpensesValidation = () => {
    return [
        body('expenses')
            .isArray({ min: 1, max: 1 })
            .withMessage('expenses field must be a non-empty array'),
        body('expenses.*.expenseDescription')
            .isString()
            .withMessage('expenseDescription field must be a string')
            .isEmpty()
            .withMessage('expenseDescription must not be empty'),
        body('expenses.*.expenseDate')
            .isDate()
            .withMessage('Invalid date'),
        body('expenses.*.expenseAmount')
            .isNumeric()
            .withMessage('expenseAmount should be a number')
            .custom((value, { req }) => {
                if (value < 0) {
                    throw new Error('expenseAmount field must be positive')
                }
            })
    ]
}