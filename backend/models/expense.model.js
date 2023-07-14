const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected', 'paid'],
        default: 'draft',
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.ObjectId,
        ref: 'Úser',
        required: true,
    },
    approver: {
        type: mongoose.ObjectId,
        ref: 'Úser',
        required: true,
    },
    expenseItems: [
        {
            description: {
                type: String,
                required: true,
            },
            category: {
                type: String,
                enum: ['meal', 'mileage', 'travel', 'accommodation', 'others'],
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
            note: String,
            receiptImg: String
        }
    ]
}, {timestamps: true})

module.exports = expenseSchema