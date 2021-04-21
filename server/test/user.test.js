const request = require('supertest')
const app = require('../app.js')
const { User } = require('../models')



describe('User Routes Test', () => {
  const user = {
    email: "edwin@mail.com",
    password: "edwin"
  }

  afterAll(done => {
    User.destroy({ where: {} })
      .then(() => done())
      .catch(err => done(err))
  })


  describe('POST /users/register', () => {
    describe('Success Case', () => {
      it('201 success create - should return create new user', (done) => {
        request(app)
          .post('/users/register')
          .send(user)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(201)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('message', 'create new user success')
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('email', user.email)
              done()
            }
          })
      })
    })

    describe('Error Case', () => {
      it('400 Failed register -  error because email is already exist in database or email must be unique', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: user.email,
            password: '1234'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual(`${user.email} is already exist`)
              done()
            }
          })
      })

      it('400 Bad Request- error because invalid format email', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: 'doni.com',
            password: 'doni123'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Invalid format email')
              done()
            }
          })
      })
      it('400 Bad Request- error because email is empty string', (done) => {
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
              expect(res.body.message[0]).toEqual('Invalid format email')
              done()
            }
          })
      })

      it('400 Bad Request- error because password is empty string', (done) => {
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
              expect(res.body.message[0]).toEqual('Password is required')
              done()
            }
          })
      })
  
      it('400 Bad Request- error because email is null', (done) => {
        request(app)
          .post('/users/register')
          .send({
            password: 'password'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Email can not be empty')
              done()
            }
          })
      })

      it('400 Bad Request- error because password is null', (done) => {
        request(app)
          .post('/users/register')
          .send({
            email: 'doni@mail.com'
          })
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(400)
              expect(typeof res.body).toEqual('object')
              expect(res.body.message[0]).toEqual('Password can not be empty')
              done()
            }
          })
      })
    })
  })

  describe('POST /users/login - user authentication process', () => {
    describe('Success Case', () => {
      it('200 OK - should return access_token', (done) => {
        request(app)
          .post('/users/login')
          .send(user)
          .end(function (err, res) {
            if (err) done(err)
            else {
              expect(res.status).toBe(200)
              expect(typeof res.body).toEqual('object')
              expect(res.body).toHaveProperty('email', user.email)
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
                expect(res.body.message[0]).toEqual('Invalid email or password')
                done()
              }
            })
        })

        it('400 Bad Request - error because invalid password', (done) => {
          request(app)
            .post('/users/login')
            .send({
              email: "edwin@mail.com",
              password: "ed"
            })
            .end(function (err, res) {
              if (err) done(err)
              else {
                expect(res.status).toBe(400)
                expect(typeof res.body).toEqual('object')
                expect(res.body.message[0]).toEqual('Invalid email or password')
                done()
              }
            })
        })
      })
    })
  })
})




