var fs = require('fs')

var constants = require('../constants')
var helpers = require('../helpers/index')

var sgf = function (filter, callback) {
  if (typeof filter == 'function') {
    callback = filter
    filter = 'ACDMRTUXB'
  }

  getHead(function (err, head) {
    if (err) {
      callback(err)
    } else {
      var command = 'git -c core.quotepath=false diff-index --cached --name-status'

      if (filter.indexOf('R') !== -1) {
        command += ' -M'
      }

      command += ' --diff-filter=' + filter + ' ' + head

      helpers.run(command, sgf.debug, function (err, stdout, stderr) {
        if (err || stderr) {
          callback(err || new Error(stderr))
        } else {
          callback(
            null,
            helpers.stdoutToResultsObject(
              stdout,
              sgf.includeContent,
              sgf.cwd
            )
          )
        }
      })
    }
  })
}

sgf.getHead = getHead
sgf.cwd = process.cwd()
sgf.debug = false
sgf.includeContent = false

sgf.readFile = function (filename, options, callback) {
  fs.readFile(sgf.cwd + '/' + filename, options, callback)
}

function getHead (callback) {
  helpers.run('git rev-parse --verify HEAD', sgf.debug, function (err, stdout, stderr) {
    if (err && err.message.indexOf('fatal: Needed a single revision') !== -1) {
      callback(null, constants.firstHead)
    } else if (err || stderr) {
      callback(err || new Error('STDERR: ' + stderr))
    } else {
      stdout = stdout.replace('\n', '')
      callback(null, stdout)
    }
  })
}

module.exports = sgf