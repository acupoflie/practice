const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/CustomError')
const util = require('util')
const sendEmail = require('../utils/email')

const signToken = id => {
    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

exports.signup = asyncErrorHandler( async (req, res, next) => {
    const newUser = await User.create(req.body)

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    })
})

exports.login = asyncErrorHandler( async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password) {
        const err = new CustomError('Please provide email and password!', 400)
        return next(err)
    }

    const user = await User.findOne({email}).select('+password')

    // const isMatch = await user.comparePasswordInDB(password, user.password)
    if(!user || !(await user.comparePasswordInDB(password, user.password))) {
        const err = new CustomError('Incorrect email or password', 400);
        return next(err);
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    })
})

exports.protect = asyncErrorHandler( async (req, res, next) => {
    const testToken = req.headers.authorization
    let token;
    if(testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1]
    }
    if(!token) next(new CustomError('You are not logged in!', 401))
    
    // const decodedToken = util.promisify(jwt.verify)(token, process.env.SECRET_STR)
    const decodedToken = jwt.verify(token, process.env.SECRET_STR)
    console.log(decodedToken)

    const user = await User.findById(decodedToken.id)
    if(!user) next(new CustomError('The user with given token does not exists', 401))

    if(await user.isPasswordChanged(decodedToken.iat)) next(new CustomError('The password has been changed recently. Please log in again.', 401))

    req.user = user;
    next()
})

exports.restrict = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            return next(new CustomError('Dont have permission to perform this action', 403))
        }
        next()
    }
}

exports.forgotPassword = asyncErrorHandler( async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return next(new CustomError('We could not find the user with given email', 404))
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use the below link to reset your password.\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes`
    
    try{
        await sendEmail({
            email: user.email,
            subject: 'Password change request received',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to the user email.'
        })
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        user.save({validateBeforeSave: false})

        return next(new CustomError('There was an error while sending reset password email.', 500))
    }
})

exports.resetPassword = (req, res, next) => {

}