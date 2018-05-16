var fs = require('fs')

var helpers = require('../helpers/index')

var sgf = function (filter, callback) {

  if (typeof filter == 'function') {
    callback = filter
    filter = 'ACDMRTUXB'
  }

  helpers.getHead(function (err, head) {
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

sgf.cwd = process.cwd()
sgf.debug = false
sgf.includeContent = false

sgf.readFile = function (filename, options, callback) {
  fs.readFile(sgf.cwd + '/' + filename, options, callback)
}

module.exports = sgf