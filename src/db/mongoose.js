const mongoose = require('mongoose')
const validator = require('validator')

//Connection to sb
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

//Create Mongoose model
const User = mongoose.model('User', {
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
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
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
    }
})

const Task =mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

//Initialize model
const me = new User({
    name: '    Devanshu',
    email: 'devanshu_gwl08@yahoo.com',
    password: 'kjhkjhsdmm'
})

const task = new Task({
    description: 'Learn Mongoose library',
})

//Save user
me.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})

task.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})
