const { writeFile } = require('node:fs/promises')
const { join } = require('node:path')
const faker = require('faker')
const { Car } = require('./../src/entities/car')
const { CarCategory } = require('./../src/entities/carCategory')
const { Customer } = require('./../src/entities/customer')

const ITEMS_AMOUNT = 2

const seederBaseFolder = join(__dirname, '..', 'database')
const carCategory = new CarCategory({
  id: faker.datatype.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100)
})
const cars = []
const customers = []

for (let index = 0; index < ITEMS_AMOUNT; index++) {
  const car = new Car({
    id: faker.datatype.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past().getFullYear()
  })
  carCategory.carIds.push(car.id)
  cars.push(car)
  const customer = new Customer({
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    age: faker.datatype.number({ min:18, max:50 })
  })
  customers.push(customer)
}

async function write (filename, data) {
  await writeFile(join(seederBaseFolder, filename), JSON.stringify(data))
}

(async () => {
  await write('carCategories.json', [carCategory])
  await write('cars.json', cars)
  await write('customers.json', customers)
})()