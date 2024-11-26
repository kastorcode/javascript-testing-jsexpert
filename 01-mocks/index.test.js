import { deepStrictEqual, rejects } from 'node:assert'
import { ERRORS } from './src/constants.js'
import { File } from './src/file.js'

(async () => {
  {
    const rejection = new Error(ERRORS.FILE_FIELDS)
    const result = File.csvToJson('./mocks/emptyFile-invalid.csv')
    await rejects(result, rejection)
  }
  {
    const rejection = new Error(ERRORS.FILE_LENGTH)
    const result = File.csvToJson('./mocks/fourItems-invalid.csv')
    await rejects(result, rejection)
  }
  {
    const rejection = new Error(ERRORS.FILE_FIELDS)
    const result = File.csvToJson('./mocks/invalid-header.csv')
    await rejects(result, rejection)
  }
  {
    const result = await File.csvToJson('./mocks/threeItems-valid.csv')
    const expected = [
      {
        "id": 13,
        "name": "Matheus",
        "profession": "Developer",
        "birthDay": 1995
      },
      {
        "id": 26,
        "name": "Davi",
        "profession": "Designer",
        "birthDay": 1999
      },
      {
        "id": 39,
        "name": "Paulo",
        "profession": "Carpenter",
        "birthDay": 1987
      }
    ]
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
  }
})()