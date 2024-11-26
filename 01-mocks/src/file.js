import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ERRORS } from './constants.js'
import { User } from './user.js'

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age']
}

export class File {

  static async csvToJson (filePath) {
    const content = await File.getFileContent(filePath)
    const validation = await File.isValid(content)
    if (!validation.valid) throw new Error(validation.error)
    const users = File.parseCSVtoJSON(content)
    return users
  }

  static async getFileContent (filePath) {
    const filename = join(process.cwd(), filePath)
    const content = (await readFile(filename)).toString('utf8')
    return content
  }

  static isValid (csvString, options=DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split('\n')
    const isHeaderValid = header === options.fields.join(',')
    if (!isHeaderValid) {
      return {
        valid: false,
        error: ERRORS.FILE_FIELDS
      }
    }
    const isContentLengthValid = (
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines
    )
    if (!isContentLengthValid) {
      return {
        valid: false,
        error: ERRORS.FILE_LENGTH
      }
    }
    return {
      valid: true
    }
  }

  static parseCSVtoJSON (csvString) {
    const lines = csvString.split('\n')
    const firstLine = lines.shift()
    const header = firstLine.split(',')
    const users = lines.map(line => {
      const columns = line.split(',')
      let user = {}
      for (const index in columns) {
        user[header[index]] = columns[index]
      }
      return new User(user)
    })
    return users
  }

}