const errorHandler = require('../middlewares/errorHandler');
const { Todo, Project } = require('../models')


class TodoController {
  static createTodo(req, res, next) {
    let { title, status, due_date, ProjectId } = req.body;
    let UserId = +req.logginUser.id
    let newTodo = { title, status, due_date, UserId, ProjectId }

    Todo.create(newTodo)
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err => next(err))
  }

  static findAll(req, res, next) {

    Todo.findAll({ where: { UserId: +req.logginUser.id } })
      .then(todos => {
        console.log(todos, 'getAll >>>>>>>>')
        res.status(200).json(todos)
          // (todos.length) ? res.status(200).json(todos) : next({ msg: 'Data not found' })
      })
      .catch(err => next(err))
  }
}



module.exports = TodoController