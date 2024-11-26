class Transaction {

  constructor ({ amount, car, customer, dueDate }) {
    this.amount = amount
    this.car = car
    this.customer = customer
    this.dueDate = dueDate
  }

}

module.exports = { Transaction }