const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/CustomError')

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