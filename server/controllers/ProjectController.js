const { Project, Todo, User, UserProject } = require('../models')
const errorHandler = require('../middlewares/errorHandler');



class ProjectController {
  static create(req, res, next) {
    const { name } = req.body;
    let UserId = +req.logginUser.id
    let newProject = { name, UserId };
    let detailProject;
    Project.create(newProject)
      .then(project => {
        detailProject = project
        return UserProject.create(
          { ProjectId: project.id, UserId },
        )
      }).then(data => {
        res.status(201).json(detailProject)
      }).catch(err => {
        next(err)
      })
  }

  static findAll(req, res, next) {
    UserProject.findAll({
      where: { UserId: +req.logginUser.id },
      include: [
        { model: Project },
        {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }],
    })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }


  static getDetailProject(req, res, next) {
    let idProject = +req.params.id
    let dataTodos;
    let dataProjects;
    let ownerProject;
    Todo.findAll({
      where: { ProjectId: idProject }
    })
      .then(todos => {
        dataTodos = todos;
        return UserProject.findAll({
          where: { ProjectId: idProject },
          include: [
            { model: Project },
            {
              model: User,
              attributes: {
                exclude: ['password']
              }
            }],
        })
      })
      .then(projects => {
        dataProjects = projects;
        return Project.findByPk(idProject, {

        })
      })
      .then(data => {
        let idOwner = data.UserId
        console.log(idOwner, 'idOwner>>')
        return User.findByPk(idOwner, {attributes: {
          exclude: ['password']
        }})
      })
      .then(user => {
        ownerProject = user
        res.status(200).json({ ownerProject, dataTodos, dataProjects })
      })
      .catch(err => next(err))
  }

  static update(req, res, next) {
    let idProject = +req.params.id;
    Project.update({ name: req.body.name }, {
      where: { id: idProject },
      returning: true
    })
      .then(project => {
        if (project[0] === 1) {
          res.status(200).json(project[1][0])
        } else {
          next({ msg: 'Data not found' })
        }
      }).catch(err => next(err))
  }

  static addUser(req, res, next) {
    let idProject = +req.params.id;
    User.findOne({
      where: { email: req.body.email }
    }).then(user => {
      if (!user) {
        next({ msg: 'User not found' })
      }
      let newData = { ProjectId: idProject, UserId: user.id }
      return UserProject.create(newData)
    })
      .then(data => {
        res.status(200).json({ message: 'Success add user as member of project' })
      })
      .catch(err => next(err))
  }

  static destroy(req, res, next) {
    //kalo delete project/update di table junction juga auto (beda sama create)
    Project.destroy({ where: { id: +req.params.id } })
      .then(() => res.status(200).json({ message: 'Success delete project' }))
      .catch(err => next(err))
  }

  static destroyUser(req, res, next) {
    User.findOne({
      where: { id: +req.params.idUser }
    })
      .then(user => {
        if (!user) {
          next({ msg: 'User not found' })
        }
        return UserProject.destroy({
          where: { UserId: +req.params.idUser }
        })
      })
      .then(() => res.status(200).json({ message: 'Success delete user in project' }))
      .catch(err => next(err))
  }

}




module.exports = ProjectController


  //https://stackoverflow.com/questions/20695062/sequelize-or-condition-object/32543638