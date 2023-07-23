// import modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const dotenv = require('dotenv')

// import controllers
const tenantController = require('./controllers/tenant.controller')
const userController = require('./controllers/user.controller')
const expenseController = require('./controllers/expense.controller')

dotenv.config()
const PORT = process.env.PORT
const server = express()
server.use(cors())
server.use(express.json())
server.use(morgan('dev'))
server.use(express.static(path.join(__dirname, 'build')))

// use controllers
server.use('/api/tenant', tenantController)
server.use('/api/user', userController)
server.use('/api/expense', expenseController)

server.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'build', "index.html"))
})

// Run backend
server.listen(PORT, () => console.log(`Running on port ${PORT}`))