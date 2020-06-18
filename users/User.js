const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email Address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    permissionLevel: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    //Hash the password before saving it to the model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email}).exec()
    if (!user) {
        throw new Error({error: 'Invalid login credentials!'})
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid login credentials!'})
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
