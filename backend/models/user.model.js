const mongoose = require('mongoose')
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNo: String,
    password: String,
    profileImg: {
        type: String,
        default: 'https://placehold.co/200x200',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    reportTo: {
        type: mongoose.ObjectId,
        ref: 'Úser',
    }
}, {timestamps: true})

userSchema.pre("save", function (next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    user.password = bcrypt.hashSync(user.password, 10)
    next()
})

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = userSchema