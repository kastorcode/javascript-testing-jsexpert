import { deepStrictEqual } from 'node:assert'
import sinon from 'sinon'
import { Fibonacci } from './fibonacci.js'

(async () => {

  {
    const fibonacci = new Fibonacci()
    const spy = sinon.spy(fibonacci, fibonacci.execute.name)
    const expectedCallCount = 4
    for await (const i of fibonacci.execute(3)) {}
    deepStrictEqual(spy.callCount, expectedCallCount)
  }

  {
    const fibonacci = new Fibonacci()
    const spy = sinon.spy(fibonacci, fibonacci.execute.name)
    const [...result] = fibonacci.execute(5)
    const secondCall = spy.getCall(2)
    const expectedResult = [0, 1, 1, 2, 3]
    const expectedParams = Object.values({
      input: 3,
      current: 1,
      next: 2
    })
    deepStrictEqual(secondCall.args, expectedParams)
    deepStrictEqual(result, expectedResult)
  }

})()