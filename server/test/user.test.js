const request = require('supertest')
const app = require('../app.js')



describe('User Routes Test', () => {
  const user = {
    email: "edwin@mail.com",
    password: "edwin"
  }

  let initialToken;

  describe('POST /users/register', () => {
    describe('Success Case', () => {
      it('201 success create - should return create new user', (done) => {
        request(app)
          .post('/users/register')
          .send(user)
          .end(function (err, res) {
            if (err) done(err)
            expect(res.status).toBe(201)
            expect(typeof res.body).toEqual('object')
            expect(res.body).toHaveProperty('message', 'create new user success')
            expect(res.body).toHaveProperty('id', expect.any(Number))
            expect(res.body).toHaveProperty('email', 'edwin@mail.com')
            done()
          })
      })

    })

    describe('Error Case', () => {
      it('400 Bad Request- error because email must be unique', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: 'edwin@mail.com',
            password: '1234'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', expect.any(Array))
              done()
            }
          })
      })
      it('400 Bad Request- error because email is empty', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: '',
            password: '1234'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', expect.any(Array))
              done()
            }
          })
      })

      it('400 Bad Request- error because password is empty', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: 'wina@mail.com',
            password: ''
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', expect.any(Array))
              done()
            }
          })
      })
    })
  })

  describe('POST /users/login', () => {
    describe('Success Case', () => {
      it('200 success login - should return access_token', (done) => {
        request(app)
          .post('/users/login')
          .send(user)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('access_token', expect.any(String))
              done()
            }
          })
      })

      describe('Error Case', () => {
        it('400 Bad Request - error because invalid email', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: "edw@mail.com",
              password: "edwin"
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('message', 'invalid email or password')
                done()
              }
            })
        })

        it('400 Bad Request - error because invalid password', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: "edwin@mail.com",
              password: "edwl"
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body).toHaveProperty('message', 'invalid email or password')
                done()
              }
            })
        })
      })
    })
  })
})