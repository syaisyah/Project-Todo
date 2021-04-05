const router = require('express').Router()
const userRoute = require('./userRoute')
const todoRoute = require('./todoRoute')
// const projectRoute =


//console.log('index.js masuk')
router.use('/users', userRoute)
router.use('/todos', todoRoute)
// router.use('/projects')

module.exports = router