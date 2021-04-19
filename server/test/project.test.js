const request = require('supertest')
const app = require('../app.js')
const { User, Todo, Project } = require('../models')
const { generateToken } = require('../helpers/token-helper')
const { hashPassword } = require('../helpers/password-helper')


let token;
let ownerToken;
let memberToken;
let idProject;
let idUser;
let idOwner;
let idMember;
let idProjectNotFound = 100
let idUserNotFound = 300

const user1 = {
  email: "lusi@mail.com",
  password: hashPassword("nina")
}

const user2 = {
  email: 'owner@mail.com',
  password: hashPassword('owner')
}

const user3 = {
  email: 'member@mail.com',
  password: hashPassword('member')
}


beforeAll(done => {
  User.create(user1)
    .then(user1 => {
      token = generateToken({ id: user1.id, email: user1.email })
      idUser = user1.id;
      return User.create(user2)
    })
    .then(user2 => {
      ownerToken = generateToken({ id: user2.id, email: user2.email })
      idOwner = user2.id;
      return User.create(user3)
    })
    .then(user3 => {
      memberToken = generateToken({ id: user3.id, email: user3.email })
      idMember = user3.id;
      done()
    })
    .catch(err => done(err))
})


afterAll(done => {
  User.destroy({ where: {} })
    .then(_ => {
      return Project.destroy({ where: {} })
    })
    .then(_ => done())
    .catch(err => done(err))
})


describe('Projects route test', () => {
  describe('POST /projects', () => {
    describe('Success Case', () => {
      it('201 Created - should return object of new project', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', ownerToken)
          .send({
            name: 'Todo App',
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              idProject = res.body.id;
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', 'Todo App')
              expect(res.body).toHaveProperty('UserId', idOwner)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user does not have access_token', (done) => {
        request(app)
          .post('/projects')
          .send({
            name: 'E-Commerce App'
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

      it('400 Bad Request - error because name is empty string', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', ownerToken)
          .send({
            name: '',
            UserId: idOwner
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Name is required')
              done()
            }
          })
      })

      it('400 Bad Request - error because name is null', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', ownerToken)
          .send({
            UserId: idOwner
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Name can not be empty')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects', () => {
    describe('Success Case', () => {
      it('200 OK - should return array of object detail projects of user login', (done) => {
        request(app)
          .get('/projects')
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body[0]).toHaveProperty('id', expect.any(Number))
              expect(res.body[0]).toHaveProperty('ProjectId', idProject)
              expect(res.body[0]).toHaveProperty('UserId', idOwner)
              expect(res.body[0].Project.id).toEqual(expect.any(Number))
              expect(res.body[0].Project.name).toEqual(expect.any(String))
              expect(res.body[0].Project.UserId).toEqual(idOwner)
              expect(res.body[0].User.id).toEqual(idOwner)
              expect(res.body[0].User.email).toEqual(user2.email)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user does not have access_token', (done) => {
        request(app)
          .get('/projects')
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

  describe('GET /projects/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return array of object detail projects including todos and users that participated in each project', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('ownerProject', expect.any(Object))
              expect(res.body).toHaveProperty('dataTodos', expect.any(Array))
              expect(res.body).toHaveProperty('dataProjects', expect.any(Array))
              done()
            }
          })
      })
    })


    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user does not have access_token', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
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

      it('403 UnAuthorized - error because user has access_token but does not have permission to access project', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', token)
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

      it('404 Project not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .get(`/projects/${idProjectNotFound}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Project not found')
              done()
            }
          })
      })
    })
  })

  describe('PATCH /projects/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of project', (done) => {
        request(app)
          .patch(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .send({
            name: 'Todo App Update'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', 'Todo App Update')
              expect(res.body).toHaveProperty('UserId', idOwner)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user does not have access_token', (done) => {
        request(app)
          .patch(`/projects/${idProject}`)
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

      describe('Error Cases', () => {
        it('403 UnAuthorized - error because user token is not ownerToken', (done) => {
          request(app)
            .patch(`/projects/${idProject}`)
            .set('access_token', token)
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

        it('403 UnAuthorized - error because user token is not ownerToken', (done) => {
          request(app)
            .patch(`/projects/${idProject}`)
            .set('access_token', memberToken)
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

        it('404 Project not found - error because project with the specific id does not exist in database', (done) => {
          request(app)
            .patch(`/projects/${idProjectNotFound}`)
            .set('access_token', ownerToken)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Project not found')
                done()
              }
            })
        })

        it('400 Bad Request - error because project name is empty string', (done) => {
          request(app)
            .patch(`/projects/${idProject}`)
            .set('access_token', ownerToken)
            .send({
              name: ''
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Name is required')
                done()
              }
            })
        })
      })
    })
  })

  describe('PATCH /projects/:id/addUser', () => {
    describe('Success Case', () => {
      it('200 Created - should return object of message', (done) => {
        request(app)
          .patch(`/projects/${idProject}/addUser`)
          .set('access_token', ownerToken)
          .send({
            email: user3.email
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Success add user as member of project')
              done()
            }
          })
      })
    })
    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user has not yet loggin or does not have access_token', (done) => {
        request(app)
          .patch(`/projects/:${idProject}/addUser`)
          .send({
            email: user3.email
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

      it('403 Forbidden UnAuthorized - error because user token is not ownerToken', (done) => {
        request(app)
          .patch(`/projects/${idProject}/addUser`)
          .set('access_token', token)
          .send({
            email: user3.email
          })
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

      it('403 Forbidden UnAuthorized - error because user token is not ownerToken', (done) => {
        request(app)
          .patch(`/projects/${idProject}/addUser`)
          .set('access_token', memberToken)
          .send({
            email: user1.email
          })
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

      it('404 User not found - error because new user does not exist in database system', (done) => {
        request(app)
          .patch(`/projects/${idProject}/addUser`)
          .set('access_token', ownerToken)
          .send({
            email: 'nouser@mail.com'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('User not found')
              done()
            }
          })
      })

      it('404 Project not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .patch(`/projects/${idProjectNotFound}/addUser`)
          .set('access_token', ownerToken)
          .send({
            email: user1.email
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Project not found')
              done()
            }
          })
      })
      it('400 Bad Request - error because new user is already registered in project', (done) => {
        request(app)
          .patch(`/projects/${idProject}/addUser`)
          .set('access_token', ownerToken)
          .send({
           email: user3.email
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('User is already registered in project')
              done()
            }
          })
      })
    })
  })

  describe('DELETE /projects/:id/deleteUser/:idUser', () => {
    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user has not yet loggin', (done) => {
        request(app)
          .patch(`/projects/${idProject}/deleteUser/${idMember}`)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('UnAuthenticated')
            done()
          })
      })

      it('403 UnAuthorized - error because user has access_token but not ownerToken', (done) => {
        request(app)
          .patch(`/projects/${idProject}/deleteUser/${idMember}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('UnAuthorized')
            done()
          })
      })

      it('404 Not Found - error because idUser is not found', (done) => {
        request(app)
          .patch(`/projects/${idProject}/deleteUser/${idUserNotFound}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(404)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('User not found')
            done()
          })
      })

    })

    describe('Success Case', () => {
      it('200 OK - should return object of message success', (done) => {
        request(app)
          .patch(`/projects/${idProject}/deleteUser/${idMember}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Success delete user in project')
              done()
            }
          })
      })
    })
  })

  describe('DELETE /projects/:id', () => {
    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user has not yet loggin', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('UnAuthenticated')
            done()
          })
      })

      it('403 Forbidden UnAuthorized - error because user has access_token but is not ownerToken', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('UnAuthorized')
            done()
          })
      })

      it('403 Forbidden UnAuthorized - error because user has access_token but is not ownerToken', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', memberToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('UnAuthorized')
            done()
          })
      })

      it('404 Project Not Found - error because data project not found', (done) => {
        request(app)
          .delete(`/projects/${idProjectNotFound}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(404)
            expect(typeof res.body).toEqual('object')
            expect(res.body.message[0]).toEqual('Project not found')
            done()
          })
      })
    })
    describe('Success Case', () => {
      it('200 OK - should return object of message success', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Success delete project')
              done()
            }
          })
      })
    })
  })
  
})
