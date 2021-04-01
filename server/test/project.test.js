const request = require('supertest')
const app = require('../app.js')

let ownerToken;
let token;
let idProject;
let idTodo;

describe('Projects route test', () => {

  describe('POST /projects', () => {
    describe('Success Case', () => {
      it('201 Created - should return object of new project', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', token)
          .send({
            name: 'Dragon App'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', 'Dragon App')
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - error because user does not have access_token', (done) => {
        request(app)
          .post('/projects')
          .send({
            name: 'Dragon App'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })
      it('400 Bad Request - error because name is empty', (done) => {
        request(app)
          .post('/projects')
          .set('access_token', token)
          .send({
            name: ''
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'name is required')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects', () => {
    describe('Success Case', () => {
      it('200 OK - should return array of object projects', (done) => {
        request(app)
          .get('/projects')
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name')
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthoriized - error because user does not have access_token', (done) => {
        request(app)
          .get('/projects')
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because user does not have any project', (done) => {
        request(app)
          .get('/projects')
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of project', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name')
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthoriized - error because user does not have access_token', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .get(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })
    })
  })

  describe('DELETE /projects/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of message success', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', ownerToken)
      })
    })

    describe('Error Cases', () => {
      it('401 UnAthorized - error because user access_token is not ownerToken', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('404 UnAthorized - error because data project not found', (done) => {
        request(app)
          .delete(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(404)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'Data not found')
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
            name: 'Dragon App Update'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', 'Dragon App Update')
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthoriized - error because user token is not ownerToken', (done) => {
        request(app)
          .patch(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .patch(`/projects/${idProject}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })

      it('400 Bad Request - error because project name is empty', (done) => {
        request(app)
          .patch(`/projects/${idProject}`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'name is required')
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
            email: 'nana@mail.com'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('name')
              expect(res.body).toHaveProperty('User', expect.any(Array))
              done()
            }
          })
      })

    })
    describe('Error Cases', () => {
      it('401 UnAuthoriized - error because user token is not ownerToken', (done) => {
        request(app)
          .patch(`/projects/:${idProject}/addUser`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .patch(`/projects/:${idProject}/addUser`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })
    })
  })

  describe('GET /projects/:ProjectId/todos', () => {
    describe('Success Case', () => {
      it('200 OK - should return array of all object todos in specific project', (done) => {
        request(app)
          .get(`/projects/${idProject}/todos`)
          .set('access_token', ownerToken)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title')
              expect(res.body).toHaveProperty('status')
              expect(res.body).toHaveProperty('due_date')
              expect(res.body).toHaveProperty('UserId', null)
              expect(res.body).toHaveProperty('ProjectId')
              done()
            }
          })
      })

      describe('Error Cases', () => {
        it('401 UnAuthoriized - error because user does not have access_token', (done) => {
          request(app)
            .get(`/projects/${idProject}/todos`)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(401)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('message', 'UnAuthorized')
                done()
              }
            })
        })

        it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
          request(app)
            .get(`/projects/${idProject}/todos`)
            .set('access_token', token)
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(404)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('message', 'Data not found')
                done()
              }
            })
        })

      })
    })
  })

  //point 8 create todo in project
  describe('POST /projects/:ProjectId/todos', () => {
    describe('Success Case', () => {
      it('201 Created - should return object of new Todo in Project', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .set('access_token', token)
          .send({
            title: 'Planning Term of Reference',
            status: 'Uncompleted',
            due_date: '2021-04-14',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', 'Planning Term of Reference')
              expect(res.body).toHaveProperty('status', 'Uncompleted')
              expect(res.body).toHaveProperty('due_date', '2021-04-14')
              expect(res.body).toHaveProperty('UserId', null)
              expect(res.body).toHaveProperty('ProjectId', idProject)
              done()
              //jangan lupa juga create ke table junction UserId dan ProjectId nya 
            }
          })
      })

    })

    describe('Error Cases', () => {
      it('401 UnAuthoriized - error because user does not have access_token', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })

      //validation
      it('400 Bad Request - error because title is empty', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .set('access_token', token)
          .send({
            title: '',
            status: 'Uncompleted',
            due_date: '2021-04-14',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'title is required')
              done()
            }
          })
      })
      it('400 Bad Request - error because status is empty', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .set('access_token', token)
          .send({
            title: 'Planning Term of Reference',
            status: '',
            due_date: '2021-04-14',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'status is required')
              done()
            }
          })
      })
      it('400 Bad Request - error because due_date validation', (done) => {
        request(app)
          .post(`/projects/${idProject}/todos`)
          .set('access_token', token)
          .send({
            title: 'Planning Term of Reference',
            status: 'Uncompleted',
            due_date: '2021-03-30',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'date must be more than or equal to today')
              done()
            }
          })
      })

    })
  })

  //point 9 Update Todo in Project /projects/:ProjectId/:TodoId
  describe('PUT /projects/:ProjectId/:TodoId', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of new todos in specific project', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', expect.any(String))
              expect(res.body).toHaveProperty('status', expect.any(String))
              expect(res.body).toHaveProperty('due_date')
              expect(res.body).toHaveProperty('UserId', null)
              expect(res.body).toHaveProperty('ProjectId')
              done()
            }
          })

      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - error because user does not have access_token', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })

      //validation
      it('400 Bad Request - error because title is empty', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .send({
            title: '',
            status: 'Uncompleted',
            due_date: '2021-04-14',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'title is required')
              done()
            }
          })
      })
      it('400 Bad Request - error because status is empty', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .send({
            title: 'Planning Term of Reference',
            status: '',
            due_date: '2021-04-14',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'status is required')
              done()
            }
          })
      })
      it('400 Bad Request - error because due_date validation', (done) => {
        request(app)
          .put(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .send({
            title: 'Planning Term of Reference',
            status: 'Uncompleted',
            due_date: '2021-03-30',
            ProjectId: `${idProject}`
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'date must be more than or equal to today')
              done()
            }
          })
      })

    })
  })

  //point 10 Delete Todo in Project /projects/:ProjectId/:TodoId
  describe('DELETE /projects/:ProjectId/:TodoId', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of success message delete todo in project', (done) => {
        request(app)
          .delete(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Delete todo in project success')
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - error because user does not have access_token', (done) => {
        request(app)
          .delete(`/projects/${idProject}/${idTodo}`)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })

      it('404 Data not found - error because project with the specific id does not exist in database', (done) => {
        request(app)
          .delete(`/projects/${idProject}/${idTodo}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'Data not found')
              done()
            }
          })
      })
    })
  })
})