const { verifyToken } = require('../helpers/token-helper')
const { User, Todo, Project, UserProject } = require('../models')
const errorHandler = require('./errorHandler')


//jadi: kalo gada access_token, dia gakan masuk ke tr -> tapi langsung di larikan ke catch(err)
const authentication = (req, res, next) => {
  try {
    let decode = verifyToken(req.headers.access_token)
    User.findByPk(+decode.id)
      .then(user => {
        if (user) {
          req.logginUser = { id: user.id, email: user.email }
          next()
        } else {
          next(err)
        }
      }).catch(err => {
        next(err)
      })
  } catch (err) {
    next(err)
  }
}


const authOwnerMemberProject = (req, res, next) => {
  if (!req.body.ProjectId) {
    console.log('masuk !req.body.ProjectId')
    next()
  } else {
    UserProject.findAll({ where: { ProjectId: +req.body.ProjectId } })
      .then(projects => {
        if (projects.length) {
          let isAuthorized = projects.find(el => el.UserId === +req.logginUser.id)
          isAuthorized ? next() : next({ msg: 'UnAuthorized' })
        } else {
          next({ msg: 'Project not found' })
        }
      })
      .catch(err => next(err))
  }
}


const authOwnerTodo = (req, res, next) => {
  let idTodo = +req.params.id
  Todo.findByPk(idTodo)
    .then(todo => {
      if (todo) {
        let isAuthorized = todo.UserId === +req.logginUser.id
        isAuthorized ? next() : next({ msg: 'UnAuthorized' })
      } else {
        next({ msg: 'Todo not found' })
      }
    })
    .catch(err => next(err))
}


const authProject = (req, res, next) => {
  let idProject = +req.params.id
  Project.findByPk(idProject)
    .then(project => {
      if (project) {
        let isAuthorized = project.UserId === +req.logginUser.id
        isAuthorized ? next() : next({ msg: 'UnAuthorized' })
      } else {
        next({ msg: 'Project not found' })
      }
    })
    .catch(err => next(err))
}




module.exports = { authentication, authOwnerMemberProject, authOwnerTodo, authProject}