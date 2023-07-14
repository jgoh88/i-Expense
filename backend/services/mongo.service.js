const mongoose = require('mongoose')
const dotenv = require('dotenv')
const tenantSchema = require('../models/tenant.model')
const userSchema = require('../models/user.model')
const expenseSchema = require('../models/expense.model')

dotenv.config()

const TenantSchemas = new Map([['Tenant', tenantSchema]])
const AppSchemas = new Map([
    ['User', userSchema], 
    ['Expense', expenseSchema]
])

function connectDB() {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_CLUSTER, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 30000,
        })
            .then(conn => {
                console.log('Connected to mongo cluster')
                resolve(conn)
            }) 
            .catch(err => reject(err))
    })
}

async function switchTenantDB() {
    const mongoose = await connectDB()
    if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.useDb(process.env.TENANT_DB_NAME, { useCache:true })
        console.log(`Switched to db ${process.env.TENANT_DB_NAME}`)
        // Prevent from schema re-registration
        if (!Object.keys(db.models).length) {
            TenantSchemas.forEach((schema, modelName) => {
                db.model(modelName, schema)
            })
        }
        return db
    }
    throw new Error('error')
}

async function switchCustomerDB(dbName) {
    const mongoose = await connectDB()
    if (mongoose.connection.readyState === 1) {
        const db = mongoose.connection.useDb(dbName, { useCache:true })
        console.log(`Switched to db ${dbName}`)
        // Prevent from schema re-registration
        if (!Object.keys(db.models).length) {
            AppSchemas.forEach((schema, modelName) => {
                db.model(modelName, schema)
            })
        }
        return db
    }
    throw new Error('error')
}

async function getDBModel(db, modelName){
    return db.model(modelName)
}

module.exports = {switchTenantDB, switchCustomerDB, getDBModel}