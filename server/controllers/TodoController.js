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
        res.status(200).json(todos)
      })
      .catch(err => next(err))
  }

  static getByIdTodo(req, res, next) {
    Todo.findByPk(+req.params.id)
      .then(todo => {
        todo ? res.status(200).json(todo) : next({ msg: 'Data not found' })
      })
      .catch(err => next(err))
  }

  static destroyByIdTodo(req, res, next) {
    Todo.destroy({ where: { id: + req.params.id } })
      .then(todo => {
        res.status(200).json({ message: 'Delete Todo Success' })
      })
      .catch(err => next(err))
  }

  static updateTodo(req, res, next) {
    const { title, status, due_date } = req.body;
    const newTodo = { title, status, due_date }
    Todo.update(newTodo, {
      where: { id: +req.params.id },
      returning: true
    })
      .then(todo => {
        res.status(200).json(todo[1][0])
      })
      .catch(err => next(err))
  }

  static updateStatusTodo(req, res, next) {
    const { status } = req.body;
    Todo.update({ status }, { where: { id: +req.params.id }, returning: true })
      .then(todo => {
        res.status(200).json(todo[1][0])

      }).catch(err => {
        console.log(err)
        next(err)
      })
  }
}



module.exports = TodoController