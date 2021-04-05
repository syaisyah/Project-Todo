const request = require('supertest')
const app = require('../app.js')
const { User, Todo, Project, UserProject } = require('../models')
const { generateToken } = require('../helpers/token-helper')
const { hashPassword } = require('../helpers/password-helper')


let token;
let ownerProjectToken;
let memberProjectToken;
let forbiddenToken;
let idTodo;
let idTodoNotFound = 500;
let idTodoInProject;
let idUser;
let idUserOwner;
let idUserMember;
let idProject;


const user1 = {
  email: "nina@mail.com",
  password: hashPassword("nina")
}

const user2 = {
  email: 'levin@mail.com',
  password: hashPassword('owner')
}

const user3 = {
  email: 'dini@mail.com',
  password: hashPassword('member')
}

const user4 = {
  email: 'roni@mail.com',
  password: hashPassword('roni')
}


beforeAll(done => {
  User.create(user1)
    .then(user1 => {
      token = generateToken({ id: user1.id, email: user1.email })
      idUser = user1.id;
      return User.create(user2)
    })
    .then(user2 => {
      idUserOwner = user2.id;
      ownerProjectToken = generateToken({ id: user2.id, email: user2.email })
      const project = {
        name: 'MRT Project',
        UserId: idUserOwner
      }

      return Project.create(project)
    })
    .then(project => {
      idProject = project.id;
      return UserProject.create({ ProjectId: idProject, UserId: idUserOwner })
    })
    .then(_ => {
      return User.create(user3)
    })
    .then(user3 => {
      idUserMember = user3.id;
      memberProjectToken = generateToken({ id: user3.id, email: user3.email })
      return UserProject.create({ ProjectId: idProject, UserId: idUserMember })
    })
    .then(_ => {
      return User.create(user4)
    })
    .then(user4 => {
      forbiddenToken = generateToken({ id: user4.id, email: user4.email })
      done()
    })
    .catch(err => done(err))
})


afterAll(done => {
  User.destroy({ where: {} })
    .then(_ => {
      return Todo.destroy({ where: {} })
    })
    .then(_ => {
      return Project.destroy({ where: {} })
    })
    .then(_ => done())
    .catch(err => done(err))
})

describe('Todos Route Tests', () => {

  describe('POST /todos', () => {
    describe('Success Case', () => {
      it('should return object of new todo with status 201 Created', (done) => {
        const todo1 = {
          title: 'Learn React js',
          status: 'Uncompleted',
          due_date: new Date(),
          ProjectId: null
        }
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send(todo1)
          .end(function (err, res) {
            if (err) done(err)
            else {
              idTodo = res.body.id;
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', todo1.title)
              expect(res.body).toHaveProperty('status', todo1.status)
              expect(res.body).toHaveProperty('due_date', todo1.due_date.toISOString())
              expect(res.body).toHaveProperty('UserId', idUser)
              expect(res.body).toHaveProperty('ProjectId', null)
              done()
            }
          })
      })

      it('should return object of new todo with status 201 Created', (done) => {
        const todo2 = {
          title: 'Planning KOM',
          status: 'Uncompleted',
          due_date: new Date(),
          ProjectId: idProject
        }
        request(app)
          .post('/todos')
          .set('access_token', ownerProjectToken)
          .send(todo2)
          .end(function (err, res) {
            if (err) done(err)
            else {
              idTodoInProject = res.body.id;
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', todo2.title)
              expect(res.body).toHaveProperty('status', todo2.status)
              expect(res.body).toHaveProperty('due_date', todo2.due_date.toISOString())
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              expect(res.body).toHaveProperty('ProjectId', idProject)
              done()
            }
          })
      })

      it('should return object of new todo with status 201 Created', (done) => {
        const todo3 = {
          title: 'Mapping tor',
          status: 'Uncompleted',
          due_date: new Date(),
          ProjectId: idProject
        }
        request(app)
          .post('/todos')
          .set('access_token', memberProjectToken)
          .send(todo3)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', todo3.title)
              expect(res.body).toHaveProperty('status', todo3.status)
              expect(res.body).toHaveProperty('due_date', todo3.due_date.toISOString())
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              expect(res.body).toHaveProperty('ProjectId', idProject)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because does not have access_token', (done) => {
        request(app)
          .post('/todos')
          .send({
            title: 'Learn Design',
            status: 'Uncompleted',
            due_date: '2021-04-03'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthenticated')
              done()
            }
          })
      })

      it('400 Bad Request - error because title is empty string', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: '',
            status: 'Uncompleted',
            due_date: '2021-04-03',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Title is required')
              done()
            }
          })
      })

      it('400 Bad Request - error because status is empty string', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            status: '',
            due_date: '2021-04-03',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Status is required')
              done()
            }
          })
      })

      it('400 Bad Request - error because due_date is empty string', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            status: 'Uncompleted',
            due_date: '',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Due date is required')
              done()
            }
          })
      })
      
      it('400 Bad Request - error because title is null', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            status: 'Uncompleted',
            due_date: '2021-04-03',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Title can not be empty')
              done()
            }
          })
      })

      it('400 Bad Request - error because status is null', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            due_date: '2021-04-03',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Status can not be empty')
              done()
            }
          })
      })

      it('400 Bad Request - error because due_date is null', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            status: 'Uncompleted',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Due date can not be empty')
              done()
            }
          })
      })
    })
  })

  describe('GET /todos', () => {
    describe('Success Case', () => {
      it('200 OK - should return array of object todo', (done) => {
        request(app)
          .get('/todos')
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              // console.log(JSON.stringify(res.body, null, 3))
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body[0]).toHaveProperty('id', expect.any(Number))
              expect(res.body[0]).toHaveProperty('title')
              expect(res.body[0]).toHaveProperty('status')
              expect(res.body[0]).toHaveProperty('due_date')
              expect(res.body[0]).toHaveProperty('UserId')
              expect(res.body[0]).toHaveProperty('ProjectId')
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because does not have access_token', (done) => {
        request(app)
          .get('/todos')
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthenticated')
              done()
            }
          })
      })
    })
  })

  describe('GET /todos/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of todo', (done) => {
        request(app)
          .get(`/todos/${idTodo}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('title')
              expect(res.body).toHaveProperty('status')
              expect(res.body).toHaveProperty('due_date')
              expect(res.body).toHaveProperty('UserId')
              expect(res.body).toHaveProperty('ProjectId')
              done()
            }
          })
      })
      describe('/Error Cases', () => {
        it('401 UnAuthenticated - error because user have not yet loggin or does not have any access_token', (done) => {
          request(app)
            .get(`/todos/${idTodo}`)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(401)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthenticated')
                done()
              }
            })
        })
        it('403 Forbidden UnAuthorized - error because user have access_token but trying to access todo that is not belonging to him', (done) => {
          request(app)
            .get(`/todos/${idTodo}`)
            .set('access_token', forbiddenToken)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthorized')
                done()
              }
            })
        })
        it('403 Forbidden UnAuthorized - error because user have access_token but trying to access todo that is not belonging to him', (done) => {
          request(app)
            .get(`/todos/${idTodoInProject}`)
            .set('access_token', forbiddenToken)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthorized')
                done()
              }
            })
        })
        it('404 Data not found - error because data not found', (done) => {
          request(app)
            .get(`/todos/${idTodoNotFound}`)
            .set('access_token', token)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Data not found')
                done()
              }
            })
        })

      })
    })

    describe('PUT /todos/:id', () => {
      describe('Success Case', () => {
        it('200 OK - should return object of todo', (done) => {

          request(app)
            .put(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(200)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('title', 'Learn Design Update')
                expect(res.body).toHaveProperty('status', 'Completed')
                expect(res.body).toHaveProperty('due_date')
                expect(res.body).toHaveProperty('UserId', idUser)
                expect(res.body).toHaveProperty('ProjectId', null)
                done()
              }
            })
        })
        it('200 OK - should return object of todo', (done) => {
          request(app)
            .put(`/todos/${idTodoInProject}`)
            .set('access_token', ownerProjectToken)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(200)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('title', 'Learn Design Update')
                expect(res.body).toHaveProperty('status', 'Completed')
                expect(res.body).toHaveProperty('due_date')
                expect(res.body).toHaveProperty('UserId', expect.any(Number))
                expect(res.body).toHaveProperty('ProjectId', idProject)
                done()
              }
            })
        })
      })

      describe('Error Cases', () => {
        it('401 UnAuthenticated - error because user has not yet loggin or does not have any access_token', (done) => {
          request(app)
            .put(`/todos/${idTodo}`)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthenticated')
              done()
            })
        })

        it('403 Forbidden UnAuthorized - error because user has loggin but UnAuthorized', (done) => {
          request(app)
            .put(`/todos/${idTodo}`)
            .set('access_token', forbiddenToken)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(403)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthorized')
              done()
            })
        })

        it('403 Forbidden UnAuthorized - error because user has loggin but UnAuthorized', (done) => {
          request(app)
            .put(`/todos/${idTodoInProject}`)
            .set('access_token', forbiddenToken)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(403)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthorized')
              done()
            })
        })

        it('404 Data not found - error because data not found', (done) => {
          request(app)
            .put(`/todos/${idTodoNotFound}`)
            .set('access_token', token)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Data not found')
                done()
              }
            })
        })

        it('400 Bad Request- error because sequelize validation error - title is empty', (done) => {
          request(app)
            .put(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              title: '',
              status: 'Completed',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Title is required')
                done()
              }
            })
        })
        it('400 Bad Request- error because sequelize validation error - status is empty', (done) => {
          request(app)
            .put(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              title: 'Learn Design Update',
              status: '',
              due_date: '2021-04-03',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Status is required')
                done()
              }
            })
        })
        it('400 Bad Request- error because sequelize validation error - due date is empty', (done) => {
          request(app)
            .put(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              title: 'Learn Design Update',
              status: 'Completed',
              due_date: ''
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Due date is required')
                done()
              }
            })
        })
      })
    })

    describe('PATCH /todos/:id', () => {
      describe('Success Case', () => {
        it('200 OK - should return object of todo', (done) => {
          request(app)
            .patch(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              status: 'Completed',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(200)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('id', expect.any(Number))
                expect(res.body).toHaveProperty('title')
                expect(res.body).toHaveProperty('status', 'Completed')
                expect(res.body).toHaveProperty('due_date')
                expect(res.body).toHaveProperty('UserId', idUser)
                expect(res.body).toHaveProperty('ProjectId', null)
                done()
              }
            })
        })
      })

      describe('Error Cases', () => {
        it('401 UnAuthenticated - error because user has not yet loggin', (done) => {
          request(app)
            .patch(`/todos/${idTodo}`)
            .send({
              status: 'Completed',
            })
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthenticated')
              done()
            })
        })
        it('403 UnAuthorized - error because user has loggin but notAuthorized to access data todo', (done) => {
          request(app)
            .patch(`/todos/${idTodo}`)
            .set('access_token', forbiddenToken)
            .send({
              status: 'Completed',
            })
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(403)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('UnAuthorized')
              done()
            })
        })
        it('404 Data not found - error because data not found', (done) => {
          request(app)
            .patch(`/todos/${idTodoNotFound}`)
            .set('access_token', token)
            .send({
              status: 'Completed',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Data not found')
                done()
              }
            })
        })

        it('400 Bad Request- error because sequelize validation error - status is empty', (done) => {
          request(app)
            .patch(`/todos/${idTodo}`)
            .set('access_token', token)
            .send({
              status: '',
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Status is required')
                done()
              }
            })
        })
      })
    })

    describe('DELETE /todos/:id', () => {
      describe('Success Case', () => {
        it('200 OK - should return object of message success', (done) => {
          request(app)
            .delete(`/todos/${idTodo}`)
            .set('access_token', token)
            .end(function (err, res) {
              if (err) done(err)
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Delete Todo Success')
              done()
            })
        })

        describe('Error Cases', () => {
          it('401 UnAuthenticated - error because user have not loggin yet or does not have any access_token', (done) => {
            request(app)
              .delete(`/todos/${idTodo}`)
              .end(function (err, res) {
                if (err) done(err)
                expect(res.status).toBe(401)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthenticated')
                done()
              })
          })

          it('403 Forbidden UnAuthorized - error because user have access_token but UnAuthorized', (done) => {
            request(app)
              .delete(`/todos/${idTodoInProject}`)
              .set('access_token', token)
              .end(function (err, res) {
                if (err) done(err)
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthorized')
                done()
              })
          })
          it('403 Forbidden UnAuthorized - error because user have access_token but UnAuthorized in project', (done) => {
            request(app)
              .delete(`/todos/${idTodoInProject}`)
              .set('access_token', forbiddenToken)
              .end(function (err, res) {
                if (err) done(err)
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('UnAuthorized')
                done()
              })
          })

          it('404 Data not found - error because data not found', (done) => {
            request(app)
              .delete(`/todos/${idTodoNotFound}`)
              .set('access_token', token)
              .end(function (err, res) {
                if (err) done(err)
                else {
                  expect(res.status).toBe(404)
                  expect(typeof res.body).toEqual('object')
                  expect(res.body.message[0]).toEqual('Data not found')
                  done()
                }
              })
          })
        })
      })
    })
  })
})

