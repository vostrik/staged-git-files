var constants = require('../constants')
var run = require('./run')

var getHead = function (callback) {
  run('git rev-parse --verify HEAD', function (err, stdout, stderr) {
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

module.exports = getHead