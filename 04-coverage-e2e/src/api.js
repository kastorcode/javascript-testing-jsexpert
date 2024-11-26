const http = require('node:http')

const DEFAULT_USER = { username: 'admin', password: '123' }
const PORT = 3000

const routes = {
  default: (request, response) => {
    return response.end('Hello World!')
  },
  '/contact:get': (request, response) => {
    return response.end('Contact us page')
  },
  '/login:post': async (request, response) => {
    for await (const data of request) {
      const user = JSON.parse(data)
      if (user.username !== DEFAULT_USER.username || user.password !== DEFAULT_USER.password) {
        response.writeHead(401)
        return response.end('Logging has failed')
      }
      return response.end('Logging has succeeded')
    }
  }
}

function requestListener (request, response) {
  const { method, url } = request
  const routeKey = `${url}:${method.toLowerCase()}`
  const routeHandler = routes[routeKey] || routes.default
  response.writeHead(200, { 'Content-Type': 'text/html' })
  return routeHandler(request, response)
}

const server = http.createServer(requestListener).listen(PORT, () => console.log(`App running at ${PORT}`))

module.exports = { server }