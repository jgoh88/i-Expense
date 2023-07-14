const mongoose = require('mongoose')

const tenantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
}, {timestamps: true})

module.exports = tenantSchema