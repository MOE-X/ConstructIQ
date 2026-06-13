exports._404 = (req, res, next, msg = 'Page not found') => {
    return res.status(404).json({
        response: {
            msg: `404 | ${msg}` 
        }
    })
}

exports._500 = (err, req, res, next) => {
    console.error(err)
    return res.status(500).json({
        response: {
            msg: '500 | Internal Server Error'
        }
    }) 
}