const { Todo, Project } = require('../models')
const { Op } = require("sequelize");
const errorHandler = require('../middlewares/errorHandler');


class TodoController {

  static createTodo(req, res, next) {
    let { title, status, due_date, ProjectId } = req.body;
    if (!ProjectId) {
      ProjectId = null
    }

    let UserId = +req.logginUser.id
    let newTodo = { title, status, due_date, UserId, ProjectId }
    Todo.create(newTodo)
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err => next(err))
  }

  static findAll(req, res, next) {
    let where = { UserId: +req.logginUser.id }

    let today = new Date();
    let startDay = new Date(today);
    startDay.setDate(startDay.getDate());
    startDay.setHours(0, 0, 0, 0);

    let endDay = new Date(today)
    endDay.setHours(23, 59, 59, 999);
    
    if (req.query.status) {
      let queryStatus = req.query.status[0].toUpperCase() + req.query.status.slice(1).toLowerCase()
      where.status = queryStatus
    }

    if (req.query.due_date && req.query.due_date.toLowerCase() === 'today') {
      where.due_date = {
        [Op.gt]: startDay,
        [Op.lt]: endDay
      }
    }
   
    Todo.findAll({
      where,
      order: [['status', 'DESC']]
    })
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
    let idTodo = +req.params.id
    const { title, due_date, status } = req.body;
    const updateTodo = { title, due_date, status }

    Todo.update(updateTodo, {
      where: { id: idTodo },
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
        next(err)
      })
  }
}



module.exports = TodoController