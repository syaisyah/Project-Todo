const router = require('express').Router()
const userRoute = require('./userRoute')
// const todoRoute = 
// const projectRoute =


router.use('/users', userRoute)
// router.use('/todos')
// router.use('/projects')

module.exports = router