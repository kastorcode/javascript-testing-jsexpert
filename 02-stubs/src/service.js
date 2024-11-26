import https from 'node:https'

export class Service {

  makeRequest (url) {
    return new Promise((resolve, reject) => {
      https.get(url, response => {
        response.on('error', error => reject(error))
        response.on('data', data => resolve(JSON.parse(data)))
      })
    })
  }

  async getPlanets (url) {
    const result = await this.makeRequest(url)
    return {
      name: result.name,
      surfaceWater: result.surface_water,
      appearedIn: result.films.length
    }
  }

}