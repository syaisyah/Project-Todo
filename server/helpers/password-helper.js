const bcrypt = require('bcrypt');


const hashPassword = (password) => bcrypt.hashSync(password, 10)
const comparedPassword = (password) => bcrypt.compareSync(password, hashPassword)


module.exports = { hashPassword, comparedPassword }