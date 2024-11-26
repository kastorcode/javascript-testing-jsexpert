import { deepStrictEqual } from 'node:assert'
import sinon from 'sinon'
import { Service } from './service.js'

const BASE_URL_1 = 'https://swapi.dev/api/planets/1'
const BASE_URL_2 = 'https://swapi.dev/api/planets/2'

const mocks = {
  alderaan: await (await import('./mocks/alderaan.json', { assert: { type: 'json' } })).default,
  tatooine: await (await import('./mocks/tatooine.json', { assert: { type: 'json' } })).default
}

;(async () => {

  /* This test is wrong because it relies on external data */
  // {
  //   const service = new Service()
  //   const withoutStub = await service.makeRequest(BASE_URL_1)
  //   console.log(JSON.stringify(withoutStub))
  // }

  const service = new Service()
  const stub = sinon.stub(service, service.makeRequest.name)
  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine)
  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan)

  {
    const expected = {
      name: 'Tatooine',
      surfaceWater: '1',
      appearedIn: 5
    }
    const result = await service.getPlanets(BASE_URL_1)
    deepStrictEqual(result, expected)
  }

  {
    const expected = {
      name: 'Alderaan',
      surfaceWater: '40',
      appearedIn: 2
    }
    const result = await service.getPlanets(BASE_URL_2)
    deepStrictEqual(result, expected)
  }

})()