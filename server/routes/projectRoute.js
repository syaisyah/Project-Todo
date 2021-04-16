const router = require('express').Router()
const ProjectController = require('../controllers/ProjectController')
const { authentication, authProject, isMemberOrOwner } = require('../middlewares/auth')


router.use(authentication)
router.post('/', ProjectController.create)
router.get('/', ProjectController.findAll)
router.get('/:id', isMemberOrOwner, ProjectController.getDetailProject)
router.patch('/:id', authProject, ProjectController.update)
router.patch('/:id/addUser', authProject, ProjectController.addUser)
router.patch('/:id/deleteUser/:idUser', authProject, ProjectController.destroyUser)
router.delete('/:id', authProject, ProjectController.destroy)




module.exports = router