const router = require('express').Router()
const TodoController = require('../controllers/TodoController')
const { authentication, authOwnerMemberProject, authOwnerTodo } = require('../middlewares/auth')



router.use(authentication)
router.get('/', TodoController.findAll)
router.post('/', authOwnerMemberProject, TodoController.createTodo)
router.get('/:id', authOwnerTodo, TodoController.getByIdTodo)
router.put('/:id', authOwnerTodo, TodoController.updateTodo)
router.patch('/:id', authOwnerTodo, TodoController.updateStatusTodo)
router.delete('/:id', authOwnerTodo, TodoController.destroyByIdTodo)




module.exports = router