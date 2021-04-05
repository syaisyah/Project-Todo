const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler');

// console.log('app.js masuk')
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)
app.use(errorHandler)


module.exports = app