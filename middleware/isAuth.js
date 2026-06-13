module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({
            response: {
                success: false,
                msg: 'Unauthenticated',
                redirect: 'login'
            }
        })
    }
    next()
}