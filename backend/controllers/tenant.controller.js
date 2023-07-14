const router = require('express').Router()
const {switchTenantDB, switchCustomerDB, getDBModel} = require('../services/mongo.service')
const validateRequiredFields = require('../services/validateRequiredFields.service')
const responseList = require('../configs/response.config')

router.post('/', async (req, res) => {
    if (!validateRequiredFields(req.body, ['name', 'companyName', 'address', 'companyContactNo', 'firstName', 'lastName', 'email', 'password'])) {
        return res.status(400).json({message: responseList.BAD_REQUEST})
    }
    try {
        const tenantDB = await switchTenantDB()
        const TenantModel = await getDBModel(tenantDB, 'Tenant')
        const newTenant = new TenantModel({
            name: req.body.name,
            companyName: req.body.companyName,
            address: req.body.address,
            contactNo: req.body.companyContactNo,
        })
        await newTenant.save()

        const customerDB = await switchCustomerDB(req.body.name)
        const UserModel = await getDBModel(customerDB, 'User')
        const firstUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.lastName,
            contactNo: req.body.contactNo,
            password: req.body.password,
            isVerified: true,
            role: 'admin',
        })
        await firstUser.save()

        return res.status(201).json({message: responseList.CREATED_SUCCESS})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
})

module.exports = router