const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res, next) => {
    const {username, password} = req.body
    try {
        const hash = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hash
        })
        req.session.user = newUser
        res.status(200).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch(err) {
        res.status(400).json({
            status: "fail",
            err
        })
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({
                status: "fail",
                message: "user not found"
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if(isCorrect) {
            req.session.user = user
            return res.status(200).json({
                status: "success",
                data: {
                    user
                }
            })
        } else {
            return res.status(400).json({
                status: "fail",
                message: "password is wrong"
            })
        }

    } catch(err) {
        res.status(400).json({
            status: "fail",
            err
        })
    }
}