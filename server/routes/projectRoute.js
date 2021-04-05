const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const { authentication } = require('../middlewares/auth')


router.use(authentication)
router.post('/', ProjectController.create)



module.exports = router