exports.isNumber = (string) => {
    return /^[0-9]+$/.test(string)
}

exports.validateCreateAttendances = (attendances) => {
    const errors = []
    if (!Array.isArray(attendances) || attendances.length === 0) {
        errors.push({
            field: 'attendances',
            msg: 'Must not be an empty array'
        })
        return errors
    }

    attendances.forEach((attendance, index) => {
        // Might not use this function
        // if (!this.isNumber(attendance.projectId)) {
        //     errors.push({
        //         field: `projectId, on row nb ${index + 1}`,
        //         msg: 'Must be an integer'
        //     })
        // }
        if (!this.isNumber(attendance.workerId)) {
            errors.push({
                field: `workerId, on row nb ${index + 1}`,
                msg: 'Must be an integer'
            })
        }
        const date = new Date(attendance.attendanceDate)
        if (isNaN(date.getTime())) {
            errors.push({
                field: `attendanceDate, on row nb ${index + 1}`,
                msg: 'Must be a valid date'
            })
        }
        if (typeof attendance.isWorking !== 'boolean') {
            errors.push({
                field: `isWorking, on row nb ${index + 1}`,
                msg: 'Must be a boolean value'
            })
        } else {
            //If we want to warn about the isWorking error
            if (!attendance.isWorking && attendance.dayRate > 0) {
                errors.push({
                    msg: `Wrong entry on row ${index + 1}`
                })
            }
        }
        if (isNaN(attendance.dayRate)) {
            errors.push({
                field: `dayRate, on row nb ${index + 1}`,
                msg: 'Must be a number'
            })
        }
    })
    return errors
}

exports.validateCreatePayments = (payments) => {
    const errors = []
    if (!Array.isArray(payments) || payments.length === 0) {
        errors.push({
            field: 'payments',
            msg: 'Must not be an empty array'
        })
        return errors
    }

    payments.forEach((payment, index) => {
        // Might not use this function
        // if (!this.isNumber(payment.projectId)) {
        //     errors.push({
        //         field: `projectId, on row nb ${index + 1}`,
        //         msg: 'Must be an integer'
        //     })
        // }
        if (!this.isNumber(payment.workerId)) {
            errors.push({
                field: `workerId, on row nb ${index + 1}`,
                msg: 'Must be an integer'
            })
        }
        if (isNaN(payment.paymentAmount)) {
            errors.push({
                field: `paymentAmount, on row nb ${index + 1}`,
                msg: 'Must be a positive number'
            })
        }
    })
    return errors
}

exports.validateCreateExpenses = (expenses) => {
    const errors = []
    if (!Array.isArray(expenses) || expenses.length === 0) {
        errors.push({
            field: 'expenses',
            msg: 'Must not be an empty array'
        })
        return errors
    }

    expenses.forEach((expense, index) => {
        // Might not use this function
        // if (!this.isNumber(expense.projectId)) {
        //     errors.push({
        //         field: `projectId, on row nb ${index + 1}`,
        //         msg: 'Must be an integer'
        //     })
        // }
        if (typeof expense.expenseDescription !== 'string') {
            errors.push({
                field: `expenseDescription, on row nb ${index + 1}`,
                msg: 'Must be a string'
            })
        }
        const date = new Date(expense.expenseDate)
        if (isNaN(date.getTime())) {
            errors.push({
                field: `expenseDate, on row nb ${index + 1}`,
                msg: 'Must be a valid date'
            })
        }
        if (isNaN(expense.expenseAmount)) {
            errors.push({
                field: `expenseAmount, on row nb ${index + 1}`,
                msg: 'Must be a positive number'
            })
        }
    })
    return errors
}