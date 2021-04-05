const router = require('express').Router()
const TodoController = require('../controllers/TodoController')
const { authentication, authOwnerProject, authOwnerTodo } = require('../middlewares/auth')


//console.log('todoRoute.js masuk')

router.use(authentication)
router.get('/', TodoController.findAll)
router.post('/', authOwnerProject, TodoController.createTodo)
router.get('/:id', authOwnerTodo, TodoController.getByIdTodo)


module.exports = router