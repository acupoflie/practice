const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')

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
    passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
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

const User = mongoose.model('User', userSchema);

module.exports = User;