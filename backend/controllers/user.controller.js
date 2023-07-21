const router = require('express').Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {switchTenantDB, switchCustomerDB, getDBModel} = require('../services/mongo.service')
const {authenticateUser, authenticateAdmin} = require('../middlewares/auth.middleware')
const validateRequiredFields = require('../services/validateRequiredFields.service')
const responseList = require('../configs/response.config')

dotenv.config()

router.get('/', async (req, res) => {
    const bearerToken = req.headers?.authorization
    if (!bearerToken) {
        return res.status(401).json({message: responseList.MISSING_TOKEN})
    }
    const token = bearerToken.split(' ')[1]
    if (!token) {
        return res.status(401).json({message: responseList.MISSING_TOKEN})
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        return res.status(200).json({message: responseList.VALID_TOKEN, user: decodedToken})
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError){
            return res.status(401).json({message: responseList.INVALID_TOKEN})
        }
        if(err instanceof jwt.JsonWebTokenError){
            return res.status(401).json({message: responseList.INVALID_TOKEN})
        }
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }  
})

router.get('/all', [authenticateUser, authenticateAdmin], async (req, res) => {
    try {
        const customerDB = await switchCustomerDB(req.user.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const users = await UserModel.find({}, {firstName: 1, lastName: 1, email: 1, contactNo: 1, role: 1, reportTo: 1}).sort({"firstName": 1, "lastName": 1})
        return res.status(200).json({message: responseList.SUCCESS, users: users})
    } catch (err) {
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.post('/', [authenticateUser, authenticateAdmin], async (req, res) => {
    if (!req.body || !validateRequiredFields(req.body, ['firstName', 'lastName', 'email', 'role', 'contactNo'])) {
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
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({message: responseList.DUPLICATE_EMAIL})
        }
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.get('/login', async (req, res) => {
    if (!req.query || !validateRequiredFields(req.query, ['tenantName', 'email'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const tenantDB = await switchTenantDB()
        const TenantModel = await getDBModel(tenantDB, 'Tenant')
        const tenant = await TenantModel.findOne({name: req.query.tenantName})
        if (!tenant) {
            return res.status(404).json({message: responseList.TENANT_NOT_FOUND})
        }
        const customerDB = await switchCustomerDB(req.query.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findOne({email: req.query.email})
        if (!user) {
            return res.status(404).json({message: responseList.EMAIL_NOT_FOUND})
        }
        return res.status(200).json({message: responseList.SUCCESS, user: {
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        }})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.put('/login', async (req, res) => {
    if (!req.body || !validateRequiredFields(req.body, ['tenantName', 'email', 'password'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.body.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({message: responseList.EMAIL_NOT_FOUND})
        }
        if (user.isVerified) {
            return res.status(400).json({message: responseList.BAD_REQUEST})
        }
        user.password = req.body.password
        user.isVerified = true
        await user.save()
        return res.status(200).json({message: responseList.SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.post('/login', async (req, res) => {
    if (!req.body || !validateRequiredFields(req.body, ['tenantName', 'email', 'password'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const customerDB = await switchCustomerDB(req.body.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({message: responseList.EMAIL_NOT_FOUND})
        }
        if (!user.isValidPassword(req.body.password)) {
            return res.status(400).json({message: responseList.EMAIL_PASSWORD_ERROR})
        }
        const data = {
            id: user._id, 
            tenantName: req.body.tenantName,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImg: user.profileImg,
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '8h'})
        return res.status(200).json({message: responseList.SUCCESS, token: token, user: data})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

module.exports = router