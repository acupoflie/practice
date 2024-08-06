const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

const prodError = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.'
        })
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        devError(res, error)
    } else if (process.env.NODE_ENV === 'production') {
        prodError(res, error)
    }
}