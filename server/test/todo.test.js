const request = require('supertest')
const app = require('../app.js')


let token;
let todoId;
let todoIdNotFound = 300;

describe('Todos Route Tests', () => {

  describe('POST /todos', () => {
    describe('Success Case', () => {
      it('should return object of new todo with status 201 Created', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            status: 'Uncompleted',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', 'Learn Design')
              expect(res.body).toHaveProperty('status', 'Uncompleted')
              expect(res.body).toHaveProperty('due_date', '2021-04-03')
              expect(res.body).toHaveProperty('UserId', expect.any(String))
              expect(res.body).toHaveProperty('ProjectId', null)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('400 Bad Request - error because does not have access_token', (done) => {
        request(app)
          .post('/todos')
          .send({
            title: 'Learn Design',
            status: 'Uncompleted',
            due_date: '2021-04-03',
            UserId: 1
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
      // title is require
      it('400 Bad Request - error because title is empty', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: '',
            status: 'Uncompleted',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'title is required')
              done()
            }
          })
      })
      // status is required
      it('400 Bad Request - error because title is empty', (done) => {
        request(app)
          .post('/todos')
          .set('access_token', token)
          .send({
            title: 'Learn Design',
            status: '',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'status is required')
              done()
            }
          })
      })
      // due_date is  equal or more than today
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
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('array')
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
    })

    describe('Error Cases', () => {
      it('401 Unauthorized - error because does not have access_token', (done) => {
        request(app)
          .get('/todos')
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })
      it('404 Data not found - error because data not found', (done) => {
        request(app)
          .get('/todos')
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

  describe('GET /todos/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of todo', (done) => {
        request(app)
          .get(`/todos/${todoId}`)
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
    })

    describe('/Error Cases', () => {
      it('401 UnAuthorized - error because does not have access_token', (done) => {
        request(app)
          .get(`/todos/${todoId}`)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(re.status).toBe(401)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'UnAuthorized')
              done()
            }
          })
      })
      it('404 Data not found - error because data not found', (done) => {
        request(app)
          .get(`/todos/${todoIdNotFound}`)
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

  describe('DELETE /todos/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of message success', (done) => {
        request(app)
          .delete(`/todos/${todoId}`)
          .set('access_token', token)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(200)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'Delete Todo Success')
            done()
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - should return object of error message', (done) => {
        request(app)
          .delete(`/todos/${todoId}`)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('404 Data not found - error because data not found', (done) => {
        request(app)
          .delete(`/todos/${todoIdNotFound}`)
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

  describe('PUT /todos/:id', () => {
    describe('Success Case', () => {
      it('200 OK - should return object of todo', (done) => {
        request(app)
          .put(`/todos/${todoId}`)
          .set('access_token', token)
          .send({
            title: 'Learn Design Update',
            status: 'Completed',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', 'Learn Design Update')
              expect(res.body).toHaveProperty('status', 'Completed')
              expect(res.body).toHaveProperty('due_date', '2021-04-03')
              expect(res.body).toHaveProperty('UserId', expect.any(String))
              expect(res.body).toHaveProperty('ProjectId', null)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - should return object of error message', (done) => {
        request(app)
          .put(`/todos/${todoId}`)
          .send({
            title: 'Learn Design Update',
            status: 'Completed',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('404 Data not found - error because data not found', (done) => {
        request(app)
          .put(`/todos/${todoIdNotFound}`)
          .set('access_token', token)
          .send({
            title: 'Learn Design Update',
            status: 'Completed',
            due_date: '2021-04-03',
            UserId: 1
          })
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
      // sequelize validation error
      it('400 Bad Request- error because sequelize validation error - title is empty', (done) => {
        request(app)
          .put(`/todos/${todoId}`)
          .set('access_token', token)
          .send({
            title: '',
            status: 'Completed',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'title is required')
              done()
            }
          })
      })
      it('400 Bad Request- error because sequelize validation error - status is empty', (done) => {
        request(app)
          .put(`/todos/${todoId}`)
          .set('access_token', token)
          .send({
            title: 'Learn Design Update',
            status: '',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'status is required')
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
          .patch(`/todos/${todoId}`)
          .set('access_token', token)
          .send({
            status: 'Completed',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('title', 'Learn Design')
              expect(res.body).toHaveProperty('status', 'Completed')
              expect(res.body).toHaveProperty('due_date', '2021-04-03')
              expect(res.body).toHaveProperty('UserId', expect.any(String))
              expect(res.body).toHaveProperty('ProjectId', null)
              done()
            }
          })
      })
    })

    describe('Error Cases', () => {
      it('401 UnAuthorized - should return object of error message', (done) => {
        request(app)
          .patch(`/todos/${todoId}`)
          .send({
            status: 'Completed',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(401)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'UnAuthorized')
            done()
          })
      })

      it('404 Data not found - error because data not found', (done) => {
        request(app)
          .patch(`/todos/${todoIdNotFound}`)
          .set('access_token', token)
          .send({
            status: 'Completed',
            UserId: 1
          })
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

      it('400 Bad Request- error because sequelize validation error - status is empty', (done) => {
        request(app)
          .patch(`/todos/${todoId}`)
          .set('access_token', token)
          .send({
            title: 'Learn Design Update',
            status: '',
            due_date: '2021-04-03',
            UserId: 1
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(404)
              expect(typeof res.body).toEqual('array')
              expect(res.body).toHaveProperty('message', 'status is required')
              done()
            }
          })
      })
    })
  })
})


