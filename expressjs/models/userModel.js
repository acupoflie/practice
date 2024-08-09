const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!']
    },
    email: {
        type: String,
        required: [true, 'E-mail is required field!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is not valid!']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm your password'],
        validate: {
            validator: function(value) {
                return this.password == value
            },
            message: 'Passwords are not same!'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}})
    next()
})

userSchema.methods.comparePasswordInDB = async function(password, pswdDB) {
    return await bcrypt.compare(password, pswdDB)
}

userSchema.methods.isPasswordChanged = async function(jwtTimestamp) {
    if(this.passwordChangedAt) {
        const pswdChangedAtTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log(pswdChangedAtTimeStamp, jwtTimestamp)

        return jwtTimestamp < pswdChangedAtTimeStamp
    }
    return false
}

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha-256').update(resetToken).digest('hex')
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

    console.log(resetToken, this.passwordResetToken)

    return resetToken
}

const User = mongoose.model('User', userSchema);

module.exports = User;