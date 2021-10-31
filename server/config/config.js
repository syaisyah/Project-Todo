const env = process.env.NODE_ENV

if (env !== 'production') {
  require('dotenv').config()
}

const capsEnv = env.toUpperCase()

const username = process.env["DB_USERNAME_" + capsEnv]
const password = process.env["DB_PASSWORD_" + capsEnv]
const database = process.env["DB_NAME_" + capsEnv]
const host = process.env["DB_HOST_" + capsEnv]
const dialect = process.env["DB_DIALECT_" + capsEnv]

module.exports = {
  "development": {
    username,
    password,
    database,
    host,
    dialect
  },
  "test": {
    username,
    password,
    database,
    host,
    dialect
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false
      }
    }

  }
}

