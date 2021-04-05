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

const authOwnerProject = (req, res, next) => {
  
  if (!req.body.ProjectId) {
    next()
  } else {
    UserProject.findAll({ where: { ProjectId: +req.body.ProjectId } })
      .then(projects => {
        if (projects.length) {
          let isAuthorized = projects.find(el => el.UserId === +req.logginUser.id)
          isAuthorized ? next() : next({ msg: 'UnAuthorized' })

        } else {
          next({ msg: 'Data not found' })
        }

      })
      .catch(err => {
        console.log(err, 'catch authOwnerProject>>>>>>')
        next(err)
      })
  }
}


module.exports = { authentication, authOwnerProject }