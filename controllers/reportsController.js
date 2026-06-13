const { Op, Sequelize } = require('sequelize')
const { Project, PStatus, Expense, Worker, WRole, Attendance, Payment, Account } = require('../models/')
const { _404 } = require('./errorController')

exports.getAllIncomeOutcome = async (req, res, next) => {
    let projects
    projects = await Project.findAll({
        attributes: [
            'projectId',
            'projectDescription',
            [
                Sequelize.literal('areaInM2 * pricePerM2'),
                'income'
            ]
        ]
    })
    projects = await Promise.all(
        projects.map(async project => {
            const paymentAmount = await Payment.sum('paymentAmount', { where: { projectId: project.projectId } }) || 0
            const expenses = await Expense.sum('`expenseAmount`', { where: { projectId: project.projectId } }) || 0
            return {
                ...project.dataValues,
                outcome: {
                    payments: paymentAmount,
                    expenses: expenses,
                    total: paymentAmount + expenses
                }
            }

        })
    )
    return res.status(200).json({
        response: {
            success: true,
            msg: 'Report done!',
            projects: projects
        }
    })
}

