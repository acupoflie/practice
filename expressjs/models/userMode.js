const mongoose = require('mongoose')
const validator = require("validator")

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
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm your password']
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;