const router = require('express').Router()
const mongoose = require('mongoose')
const {switchTenantDB, switchCustomerDB, getDBModel} = require('../services/mongo.service')
const {authenticateUser, authenticateAdmin} = require('../middlewares/auth.middleware')
const validateRequiredFields = require('../services/validateRequiredFields.service')
const responseList = require('../configs/response.config')

router.get('/', authenticateUser, async (req, res) => {
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const ExpenseModel = await getDBModel(customerDB, 'Expense')
        const expenses = await ExpenseModel.find({createdBy: req.user.id, deleted: false})
        return res.status(200).json({message: responseList.SUCCESS, expenses: expenses})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.get('/all', [authenticateUser, authenticateAdmin], async (req, res) => {
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const ExpenseModel = await getDBModel(customerDB, 'Expense')
        const expenses = await ExpenseModel.find({status: {$in: ['submitted', 'approved', 'paid']}, deleted: false})
        return res.status(200).json({message: responseList.SUCCESS, expenses: expenses})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.post('/', authenticateUser, async (req, res) => {
    if (!req.body || !validateRequiredFields(req.body, ['title'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    if (!req.user?.reportTo) {
        return res.status(400).json({message: responseList.MISSING_APPROVER})
    }
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const ExpenseModel = await getDBModel(customerDB, 'Expense')
        const newExpense = new ExpenseModel({
            ...req.body,
            approver: req.user.reportTo,
            createdBy: req.user.id
        })
        newExpense.save()
        return res.status(201).json({message: responseList.CREATED_SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.put('/', authenticateUser, async (req, res) => {
    if (!req.body || !req.body.id || !mongoose.isObjectIdOrHexString(req.body?.id)) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const ExpenseModel = await getDBModel(customerDB, 'Expense')
        console.log(req.body)
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(req.body.id, {
            $set: {...req.body.data}
        })
        console.log(updatedExpense)
        return res.status(200).json({message: responseList.SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.delete('/', authenticateUser, async (req, res) => {
    if (!req.body || !req.body.id || !mongoose.isObjectIdOrHexString(req.body?.id)) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const ExpenseModel = await getDBModel(customerDB, 'Expense')
        const deletedExpense = await ExpenseModel.findOneAndUpdate({_id: req.body.id, status: {$in: ['draft', 'rejected']}}, {
            $set: {deleted: true}
        })
        if (!deletedExpense) {
            return res.status(400).json({message: responseList.EXPENSE_NOT_FOUND})
        }
        return res.status(200).json({message: responseList.SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

module.exports = router