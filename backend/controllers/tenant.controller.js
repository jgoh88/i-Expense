const router = require('express').Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {switchTenantDB, switchCustomerDB, getDBModel} = require('../services/mongo.service')
const validateRequiredFields = require('../services/validateRequiredFields.service')
const responseList = require('../configs/response.config')

dotenv.config()

router.get('/', async (req, res) => {
    const tenantName = req.query.tenantName
    try {
        const tenantDB = await switchTenantDB()
        const TenantModel = await getDBModel(tenantDB, 'Tenant')
        const existingTenant = await TenantModel.findOne({name: tenantName})
        if (existingTenant) {
            return res.status(200).json({message: 'unavailable'})
        } 
        return res.status(200).json({message: 'available'})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

router.post('/', async (req, res) => {
    if (!validateRequiredFields(req.body, ['tenantName', 'companyName', 'address', 'companyContactNo', 'firstName', 'lastName', 'email', 'password', 'contactNo'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const tenantDB = await switchTenantDB()
        const TenantModel = await getDBModel(tenantDB, 'Tenant')
        const newTenant = new TenantModel({
            name: req.body.tenantName,
            companyName: req.body.companyName,
            address: req.body.address,
            contactNo: req.body.companyContactNo,
        })
        await newTenant.save()

        const customerDB = await switchCustomerDB(req.body.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const firstUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            contactNo: req.body.contactNo,
            password: req.body.password,
            isVerified: true,
            role: 'admin',
        })
        await firstUser.save()
        const token = jwt.sign({
            id: firstUser._id, 
            tenantName: req.body.tenantName,
            firstName: firstUser.firstName,
            lastName: firstUser.lastName,
            profileImg: firstUser.profileImg,
        }, process.env.JWT_SECRET, {expiresIn: '8h'})

        return res.status(200).json({message: responseList.SUCCESS, token: token})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

module.exports = router