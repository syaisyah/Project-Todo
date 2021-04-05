const router = require('express').Router()
const TodoController = require('../controllers/TodoController')
const { authentication, authOwnerProject } = require('../middlewares/auth')


//console.log('todoRoute.js masuk')

router.use(authentication)
router.post('/', authOwnerProject, TodoController.createTodo)
router.get('/', TodoController.findAll)
module.exports = router