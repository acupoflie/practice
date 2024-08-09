
const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')
const authController = require('./authController')

exports.getAllUsers = asyncErrorHandler(async(req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        status: "success",
        length: users.length,
        data: {
            users
        }
    })
})

const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if(allowedFields.includes(prop)) {
            newObj[prop] = obj[prop]
        }
    })
    return newObj;
}

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password')

    if(!(await user.comparePasswordInDB(req.body.currentPassword, user.password))) {
        return next(new CustomError('Current password is wrong', 401))
    }

    user.password = req.body.password,
    user.confirmPassword = req.body.confirmPassword
    await user.save()

    authController.createSendResponse(user, 200, res);
})

exports.updateMe = asyncErrorHandler( async(req, res, next) => {
    if(req.body.password || req.body.confirmPassword) {
        return next(new CustomError('You cannot update your details', 400))
    }

    const filterObj = filterReqObj(req.body, 'name', 'email')
    const user = await User.findByIdAndUpdate(req.user._id, filterObj, {runValidators: true, new: true})
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.deleteMe = asyncErrorHandler( async(req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false})
    res.status(204).json({
        status: 'success',
        data: null
    })
})