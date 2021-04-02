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
    .then(_ => {
      return User.create(user2)
    })
    .then(_ => {
      return User.create(user3)
    })
    .then(_ => done())
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
  beforeAll(done => {
    User.findOne({ where: { email: user1.email } })
      .then(user1 => {
        token = generateToken({ id: user1.id, email: user1.email })
        idUser = user1.id;
        return User.findOne({ where: { email: user2.email } })
      })
      .then(user2 => {
        ownerToken = generateToken({ id: user2.id, email: user2.email })
        idOwner = user2.id;
        return User.findOne({ where: { email: user3.email } })
      })
      .then(user3 => {
        memberToken = generateToken({ id: user3.id, email: user3.email })
        idMember = user3.id;
        done()
      })
      .catch(err => done(err))
  })


  const newProject = {
    name: 'Todo App',
    UserId: idOwner
  }

  describe('POST /projects', () => {
    describe('Success Case', () => {
      it('201 Created - should return object of new project', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', ownerToken)
          .send(newProject)
          .end(function (err, res) {
            if (err) done(err)
            else {
              idProject = res.body.id;
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', newProject.name)
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'name is required')
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'name can not be empty')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects', () => {
    //cari dulu UserProject include Project dan User, lalu cari data Todo menggunakan ProjectId
    // bisa ownerToken atau memberToken
    describe('Success Case', () => {
      it('200 OK - should return array of detail projects including todos and users that participated in each project', (done) => {
        request(app)
          .get('/projects')
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('id', expect.any(Number))
              expect(res.body[0]).toHaveProperty('Projects', expect.any(Array))
              expect(res.body[0]).toHaveProperty('Users', expect.any(Array))
              expect(res.body[0]).toHaveProperty('Todos', expect.any(Array))
              done()
            }
          })
      })

      t('200 OK - should return array of detail projects including todos and users that participated in each project', (done) => {
        request(app)
          .get('/projects')
          .set('access_token', memberToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('id', expect.any(Number))
              expect(res.body[0]).toHaveProperty('Projects', expect.any(Array))
              expect(res.body[0]).toHaveProperty('Users', expect.any(Array))
              expect(res.body[0]).toHaveProperty('Todos', expect.any(Array))
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects/:id', () => {
    // bisa ownerToken atau memberToken
    describe('Success Case', () => {
      it('200 OK - should return object of detail projects including todos and users that participated in each project', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              pect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('Projects', expect.any(Array))
              expect(res.body).toHaveProperty('Users', expect.any(Array))
              expect(res.body).toHaveProperty('Todos', expect.any(Array))
              done()
            }
          })
      })
      it('200 OK - should return object of detail projects including todos and users that participated in each project', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', memberToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              pect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('Projects', expect.any(Array))
              expect(res.body).toHaveProperty('Users', expect.any(Array))
              expect(res.body).toHaveProperty('Todos', expect.any(Array))
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .get(`/projects/${idProjectNotFound}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })
    })
  })

  describe('DELETE /projects/:id', () => {
    // harus ownerToken
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


    describe('Error Cases', () => {
      it('401 UnAuthenticated - error because user has not yet loggin', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('array')
            expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
            done()
          })
      })

      it('403 Forbidden UnAuthorized - error because user has access_token but has not permission to delete project that is not belonging to him/her', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(typeof res.body).toEqual('array')
            expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('403 Forbidden UnAuthorized - error because user has access_token but has not permission to delete project that is not belonging to him/her', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', memberToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(typeof res.body).toEqual('array')
            expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('404 Not Found - error because data project not found', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(404)
            expect(typeof res.body).toEqual('array')
            expect(res.body[0]).toHaveProperty('message', 'Data not found')
            done()
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
              expect(typeof res.body).toEqual('array')
              expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
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
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
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
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
                done()
              }
            })
        })

        it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
          request(app)
            .patch(`/projects/${idProjectNotFound}`)
            .set('access_token', ownerToken)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'Data not found')
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
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'name is required')
                done()
              }
            })
        })

        it('400 Bad Request - error because project name is null', (done) => {
          request(app)
            .patch(`/projects/${idProject}`)
            .set('access_token', ownerToken)
            .send({})
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'name can not be empty')
                done()
              }
            })
        })

      })
    })

    describe('PATCH /projects/:ProjectId/addUser', () => {
      describe('Success Case', () => {
        it('201 Created - should return object of project', (done) => {
          request(app)
            .patch(`/projects/:${idProject}/addUser`)
            .set('access_token', ownerToken)
            .send({
              UserId: idMember
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(201)
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
              UserId: idMember
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(401)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'UnAuthenticated')
                done()
              }
            })
        })

        it('403 Forbidden UnAuthorized - error because user token is not ownerToken', (done) => {
          request(app)
            .patch(`/projects/:${idProject}/addUser`)
            .set('access_token', token)
            .send({
              UserId: idMember
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
                done()
              }
            })
        })

        it('403 Forbidden UnAuthorized - error because user token is not ownerToken', (done) => {
          request(app)
            .patch(`/projects/:${idProject}/addUser`)
            .set('access_token', memberToken)
            .send({
              UserId: idMember
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(403)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'UnAuthorized')
                done()
              }
            })
        })

        it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
          request(app)
            .patch(`/projects/:${idProjectNotFound}/addUser`)
            .set('access_token', ownerToken)
            .send({
              UserId: idMember
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('array')
                expect(res.body[0]).toHaveProperty('message', 'Data not found')
                done()
              }
            })
        })
      })
    })
  })
})
