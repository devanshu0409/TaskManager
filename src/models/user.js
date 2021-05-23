const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value <0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//adding virtual property
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//return public user profile
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//generate jwt token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() }, 'secretkeytoencryptjwt', { expiresIn: '7 days'})
    user.tokens = user.tokens.concat({ token})
    await user.save()

    return token
}

//verify credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Invalid username or passowrd')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid username or passowrd')
    }

    return user
}

//hash plain text passowrd
userSchema.pre('save', async function(next) {

    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//delete task befor deleteing user
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User