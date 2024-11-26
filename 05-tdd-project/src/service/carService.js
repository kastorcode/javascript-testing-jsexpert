const { Tax } = require('../entities/tax')
const { Transaction } = require('../entities/transaction')
const { BaseRepository } = require('../repository/baseRepository')

class CarService {

  constructor ({ cars }) {
    this.carRepository = new BaseRepository({ file: cars })
    this.currencyFormat = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    this.taxesBasedOnAge = Tax.taxesBasedOnAge
  }

  getRandomPositionFromArray (list) {
    return Math.floor(Math.random() * list.length)
  }

  getRandomCarId (carCategory) {
    const index = this.getRandomPositionFromArray(carCategory.carIds)
    const carId = carCategory.carIds[index]
    return carId
  }

  async getAvailableCar (carCategory) {
    const carId = this.getRandomCarId(carCategory)
    const car = await this.carRepository.find(carId)
    return car
  }

  calculateFinalPrice (customer, carCategory, numberOfDays) {
    const { age } = customer
    const { price } = carCategory
    const { then:tax } = this.taxesBasedOnAge.find(({ from, to }) => age >= from && age <= to)
    const finalPrice = (tax * price) * numberOfDays
    const formattedPrice = this.currencyFormat.format(finalPrice)
    return formattedPrice
  }

  async rent (customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory)
    const finalPrice = this.calculateFinalPrice(customer, carCategory, numberOfDays)
    const today = new Date()
    today.setDate(today.getDate() + numberOfDays)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const dueDate = today.toLocaleDateString('pt-BR', options)
    const transaction = new Transaction({ amount: finalPrice, car, customer, dueDate })
    return transaction
  }

}

module.exports = { CarService }