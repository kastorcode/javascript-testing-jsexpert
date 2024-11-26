const { deepStrictEqual } = require('node:assert')
const { describe, it } = require('mocha')
const supertest = require('supertest')
const { server } = require('./api.js')

describe('API Suite Test', () => {

  describe('/contact', () => {
    it('should request contact page and return status 200', async () => {
      const response = await supertest(server).get('/contact').expect(200)
      deepStrictEqual(response.text, 'Contact us page')
    })
  })

  describe('/hello', () => {
    it('should request not found route /hi and redirect to /hello', async () => {
      const response = await supertest(server).get('/hi').expect(200)
      deepStrictEqual(response.text, 'Hello World!')
    })
  })

  describe('/login', () => {
    it('should login successfully and return status 200', async () => {
      const response = await supertest(server)
        .post('/login')
        .send({ username: 'admin', password: '123' })
        .expect(200)
      deepStrictEqual(response.text, 'Logging has succeeded')
    })
    it('should not login and return status 401', async () => {
      const response = await supertest(server)
        .post('/login')
        .send({ username: 'guest', password: '321' })
        .expect(401)
      deepStrictEqual(response.text, 'Logging has failed')
    })
  })

})