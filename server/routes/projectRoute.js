const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const { authentication } = require('../middlewares/auth')


router.use(authentication)
router.post('/', ProjectController.create)
router.get('/', ProjectController.findAll)


module.exports = router