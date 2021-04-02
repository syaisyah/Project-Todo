const { User } = require('../models')
const { comparedPassword } = require('../helpers/password-helper')
const { generateToken } = require('../helpers/token-helper')
const errorHandler = require('../middlewares/errorHandler')

class UserController {
  static register(req, res, next) {
    const { email, password } = req.body
    const newUser = { email, password }
    User.create(newUser)
      .then(user => {
        res.status(201).json({ message: 'create new user success', id: user.id, email: user.email })
      })
      .catch(err => next(err))
  }
}

module.exports = UserController