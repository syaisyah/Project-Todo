const { Project, User, UserProject } = require('../models')
const errorHandler = require('../middlewares/errorHandler')


class ProjectController {
  static create(req, res, next) {
    const { name, ProjectId } = req.body;
    let UserId = +req.logginUser.id
    let newProject = { name, UserId };
    let detailProject;
    Project.create(newProject)
      .then(project => {
        detailProject = project
        return UserProject.create(
          { ProjectId: project.id, UserId },
          {
            include: [Project, User]
          })
      }).then(data => {
        res.status(201).json(detailProject)
      }).catch(err => {
        next(err)
      })

  }

}

module.exports = ProjectController