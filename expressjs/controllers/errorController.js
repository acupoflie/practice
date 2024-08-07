const CustomError = require('../utils/CustomError')

const devError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
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

const castErrorHandler = (err) => {
    const msg = `Invalid value ${err.path}: ${err.value}`;
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {
    const msg = `There is already movie with name ${err.keyValue.name}. Please use another name.`
    return new CustomError(msg, 400)
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message)
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data: ${errorMessages}`
    return new CustomError(msg, 400)
}

const handleExpiredJWT = (err) => {
    return new CustomError('JWT has expired. Please log in again!', 401)
}

const handleJWTError = (err) => {
    return new CustomError('Invalid token. Please log in again!', 401)
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        devError(res, error)
    } else if (process.env.NODE_ENV === 'production') {
        // let err = {...error, name: error.name}

        if(error.name === 'CastError') error = castErrorHandler(error)
        if(error.code === 11000) error = duplicateKeyErrorHandler(error)
        if(error.name === "ValidationError") error = validationErrorHandler(error)
        if(error.name === 'TokenExpiredError') error = handleExpiredJWT(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error)
        prodError(res, error)
    }
}