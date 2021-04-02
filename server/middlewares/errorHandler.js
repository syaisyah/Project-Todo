function errorHandler(err, req, res, next) {

  let statusCode = 500
  let message = "Internal server errors"

  switch (err.name) {
    case 'SequelizeValidationError':
      statusCode = 400
      message = err.errors.map(el => el.message)
      break;
    case 'SequelizeUniqueConstraintError':
      statusCode = 400
      message = err.errors.map(el => `${el.value} is already exist`)
      break;
    case "SequelizeDatabaseError":
      if (err.parent.code === '23502') {
        statusCode = 400
        message = err.errors[0].message
      }
      break;

    case 'JsonWebTokenError':
      statusCode = 401
      message = 'UnAuthenticated';
      break;
  }


  // switch (err.msg) {
  //   case 'Invalid email or password':
  //     statusCode = 400
  //     message = err.msg
  //     break;
  //   case 'UnAuthorized':
  //     statusCode = 403
  //     message = err.msg
  //     break;
  //   case 'User not found':
  //     statusCode = 400
  //     message = err.msg
  //     break;
  //   case 'Data not found':
  //     statusCode = 400
  //     message = err.msg
  //     break;
  // }

  res.status(statusCode).json({ message })
}


module.exports = errorHandler

//JsonWebTokenError: jwt must be provided -> terjadi jika tidak ada access_token 