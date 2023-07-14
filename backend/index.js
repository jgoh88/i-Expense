// import modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')

// import controllers
const tenantController = require('./controllers/tenant.controller')

dotenv.config()
const PORT = process.env.PORT
const server = express()
server.use(cors())
server.use(express.json())
server.use(morgan('dev'))

// use controllers
server.use('/api/tenant', tenantController)

// Run backend
server.listen(PORT, () => console.log(`Running on port ${PORT}`))