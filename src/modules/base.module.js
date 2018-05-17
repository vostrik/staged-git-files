const fs = require('fs')
const path = require('path')

const { firstHead } = require('../constants')
const { run, stdoutToResultsObject } = require('../helpers')

module.exports = class BaseModule {
  constructor () {
    this.cwd = process.cwd()
    this.debug = false
    this.includeContent = false
  }

  /**
   * Get list of files returned by git`s command
   * @param {string} filter - filter string for file modificators ('ACDMRTUXB')
   * @param {string} command - git`s command
   * @param {function} callback - callback to handle result
   */
  runCommand ({ filter = 'ACDMRTUXB', command, callback = () => { } } = {}) {
    run(command, this.debug, (err, stdout, stderr) => {
      if (err || stderr) {
        callback(err || new Error(stderr))
        return
      }
      callback(null, stdoutToResultsObject(
        stdout,
        this.includeContent,
        this.cwd
      ))
    })
  }

  /**
   * Get file relative to process.cwd()
   */
  readFile (filename, options, callback) {
    fs.readFile(path.join(this.cwd, filename), options, callback)
  }

  /**
   * Get current head
   * @param {function} callback - callback to handle result
   */
  getHead (callback) {
    run(
      'git rev-parse --verify HEAD',
      this.debug,
      function (err, stdout, stderr) {
        if (err &&
            err.message.indexOf('fatal: Needed a single revision') !== -1) {
          callback(null, firstHead)
          return
        }
        if (err || stderr) {
          callback(err || new Error('STDERR: ' + stderr))
          return
        }
        stdout = stdout.replace('\n', '')
        callback(null, stdout)
      }
    )
  }
}
