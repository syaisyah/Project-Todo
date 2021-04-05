const errorHandler = require('../middlewares/errorHandler');
const { Todo, Project } = require('../models')


class TodoController {
  static createTodo(req, res, next) {
    console.log(req.body,'>>body')
    let { title, status, due_date, ProjectId } = req.body;
    let UserId = +req.logginUser.id
    let newTodo = { title, status, due_date, UserId, ProjectId }
    console.log(newTodo, 'newTodo controller')

    Todo.create(newTodo)
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err => next(err))
  }
}



module.exports = TodoController