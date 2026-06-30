const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const { User } = require('../models/')

exports.login = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            response: {
                success: false,
                errors: {
                    field: errors.array()[0].path,
                    msg: errors.array()[0].msg,
                }
            }
        })
    }
    const userName = req.body.userName
    const password = req.body.password
    User.findOne({ where: { userName: userName } })
        .then(async user => {
            if (!user) {
                console.log(user)
                return res.status(422).json({
                    response: {
                        success: false,
                        msg: 'Email does not exist'
                    }
                })
            }
            const isPassword = await bcrypt.compare(password, user.password)
            if (!isPassword) {
                console.log(user)
                return res.status(422).json({
                    response: {
                        success: false,
                        msg: 'Incorrect Password'
                    }
                })
            }
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save((err) => {
                if (err) {
                    console.log(err)
                }
                res.status(200).json({
                    response: {
                        success: true,
                        msg: 'Login Successful',
                        user: user
                    }
                })
            })
        })
        .catch(err => {
            console.error('Error: ', err)
        })
}

exports.register = async (req, res, next) => {
    const { userName, password, confirmPassword } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            response: {
                success: false,
                msg: errors.array()[0].msg,
                redirect: 'register',
                old: {
                    userName: userName,
                    password: password,
                    confirmPassword: confirmPassword
                }
            }
        })
    }
    const hashedPass = await bcrypt.hash(password, 12)
    User.create({
        userName: userName,
        password: hashedPass
    })
        .then(user => {
            if (!user) {
                return res.status(500).json({
                    response: {
                        success: false,
                        msg: 'Something went wrong',
                        redirect: 'register',
                        old: {
                            userName: userName,
                            password: password,
                            confirmPassword: confirmPassword
                        }
                    }
                })
            }
            return res.status(201).json({
                response: {
                    success: true,
                    msg: 'User created successfully',
                    user: user,
                    redirect: 'login'
                }
            })
        })
        .catch(err => {
            console.error('Error: ', err)
        })
}

exports.logout = (req, res, next) => {
    req.session.isLoggedIn = false
    return res.status(200).json({
        response: {
            success: true,
            msg: 'Logged out'
        }
    })
}