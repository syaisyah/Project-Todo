const router = require('express').Router()
const userRoute = require('./userRoute')
const todoRoute = require('./todoRoute')
const projectRoute =require('./projectRoute')


router.use('/users', userRoute)
router.use('/todos', todoRoute)
router.use('/projects', projectRoute)



module.exports = router