const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {switchCustomerDB, getDBModel} = require('../services/mongo.service')
const responseList = require('../configs/response.config')

dotenv.config()

async function authenticateUser(req, res, next) {
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
        const customerDB = await switchCustomerDB(decodedToken.tenantName)
        const UserModel = await getDBModel(customerDB, 'User')
        const user = await UserModel.findById(decodedToken.id)
        req.user = user
        req.user.password = null
        req.user.tenantName = decodedToken.tenantName
        next()
    } catch (err) {
        if(err instanceof jwt.TokenExpiredError){
            return res.status(401).json({message: responseList.INVALID_TOKEN})
        }
        return res.status(500).json({message: responseList.SOMETHING_WRONG})
    }
}

function authenticateAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(401).json({message: responseList.MISSING_PERMISSION})
    }
    next()
}

module.exports = {authenticateUser, authenticateAdmin}