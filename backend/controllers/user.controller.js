const router = require('express').Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {switchTenantDB, switchCustomerDB, getDBModel} = require('../services/mongo.service')
const {authenticateUser, authenticateAdmin} = require('../middlewares/auth.middleware')
const responseList = require('../configs/response.config')

dotenv.config()

router.get('/', authenticateUser, async (req, res) => {
    return res.status(200).json({message: req.user})
})

router.post('/', [authenticateUser, authenticateAdmin], async (req, res) => {
    const checkRequiredFields = () => {
        return ['firstName', 'lastName', 'email'].reduce((t, c) => {
            if(!req.body[c] || !t) {
                return false
            }
            return true
        }, true)
    }

    if (!req.body || !checkRequiredFields()) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const newUser = new UserModel(req.body)
        await newUser.save()
        return res.status(201).json({message: responseList.CREATED_SUCCESS})
    } catch (err) {
        console.log(err)
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({message: responseList.DUPLICATE_EMAIL})
        }
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.put('/', [authenticateUser, authenticateAdmin], async (req, res) => {
    if (!req.body || !req.body.id || !mongoose.isObjectIdOrHexString(req.body?.id)) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const updatedUser = await UserModel.findByIdAndUpdate(req.body.id, {
            $set: {...req.body.data}
        })
        return res.status(200).json({message: responseList.SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.get('/login', async (req, res) => {
    if (!req.body || !req.body.tenantName || !req.body.email) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const tenantDB = await switchTenantDB()
        const TenantModel = await getDBModel(tenantDB, 'Tenant')
        const tenant = await TenantModel.findOne({name: req.body.tenantName})
        if (!tenant) {
            return res.status(404).json({message: responseList.TENANT_NOT_FOUND})
        }
        const customerDB = await switchCustomerDB(req.body.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({message: responseList.EMAIL_NOT_FOUND})
        }
        return res.status(200).json({message: responseList.SUCCESS, user: {
            email: user.email,
            isVerified: user.isVerified
        }})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.post('/login', async (req, res) => {
    if (!req.body || !req.body.tenantName || !req.body.email || !req.body.password) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.body.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({message: responseList.EMAIL_NOT_FOUND})
        }
        if (!user.isValidPassword(req.body.password)) {
            return res.status(400).json({message: responseList.EMAIL_PASSWORD_ERROR})
        }
        const token = jwt.sign({id: user._id, tenantName: req.body.tenantName}, process.env.JWT_SECRET, {expiresIn: '8h'})
        return res.status(200).json({token: token})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

module.exports = router