const { join } = require('node:path')
const { expect } = require('chai')
const { afterEach, before, beforeEach, describe, it } = require('mocha')
const sinon = require('sinon')
const { Transaction } = require('../../src/entities/transaction')
const { CarService } = require('../../src/service/carService')

const carsDatabase = join(__dirname, '../../database', 'cars.json')

const mocks = {
  validCar: require('../mocks/validCar.json'),
  validCarCategory: require('../mocks/validCarCategory.json'),
  validCustomer: require('../mocks/validCustomer.json')
}

describe('CarService Suite Test', () => {

  let carService = null
  let sandbox = null

  before(() => {
    carService = new CarService({ cars: carsDatabase })
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should retrieve a random position from an array', () => {
    const list = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(list)
    expect(result).to.be.lte(list.length).and.gte(0)
  })

  it('should choose first id from carIds in carCategory', () => {
    const carCategory = Object.create(mocks.validCarCategory)
    const carIndex = 0
    sandbox.stub(carService, carService.getRandomPositionFromArray.name).returns(carIndex)
    const result = carService.getRandomCarId(carCategory)
    const expected = carCategory.carIds[carIndex]
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.true
    expect(result).to.be.equal(expected)
  })

  it('given a car category it should return an available car', async () => {
    const car = Object.create(mocks.validCar)
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]
    sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car)
    sandbox.spy(carService, carService.getRandomCarId.name)
    const result = await carService.getAvailableCar(carCategory)
    expect(carService.carRepository.find.calledWithExactly(car.id))
    expect(carService.getRandomCarId.calledOnce).to.be.true
    expect(result).to.be.deep.equal(car)
  })

  it('given a carCategory, customer and numberOfDays it should calculate finalAmount in Real', () => {
    const customer = Object.create(mocks.validCustomer)
    customer.age = 50
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.price = 37.6
    const numberOfDays = 5
    sandbox.stub(carService, 'taxesBasedOnAge').get(() => [{ from: 40, to: 50, then: 1.3 }])
    const expected = carService.currencyFormat.format(244.40)
    const result = carService.calculateFinalPrice(customer, carCategory, numberOfDays)
    expect(result).to.be.deep.equal(expected)
  })

  it('given a customer and a carCategory it should return a transaction receipt', async () => {
    const car = Object.create(mocks.validCar)
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id]
    }
    const customer = Object.create(mocks.validCustomer)
    customer.age = 20
    const numberOfDays = 5
    const dueDate = '10 de novembro de 2020'
    const now = new Date(2020, 10, 5)
    sandbox.useFakeTimers(now.getTime())
    sandbox.stub(carService, carService.getAvailableCar.name).resolves(car)
    const result = await carService.rent(customer, carCategory, numberOfDays)
    const expectedAmount = carService.currencyFormat.format(206.80)
    const expected = new Transaction({ amount: expectedAmount, car, customer, dueDate })
    expect(result).to.be.deep.equal(expected)
  })

})