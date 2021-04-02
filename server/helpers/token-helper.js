const jwt = require('jsonwebtoken')


const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY)
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY)


module.exports = { generateToken, verifyToken }